import { Repository } from "typeorm";
import { pgDataSource } from "../data_source";
import { questionService } from "../question/question.controller";
import { Question } from "../question/question.entity";
import { SlackService } from "../slack/slack.service";
import { addScheduledDates } from "../utils/add_scheduled_dates";
import { cronService } from "./channel.controller";
import { Channel, QueuedQuestion } from "./channel.entity";
import { CreateChannelDto } from "./dto/create_channel.dto";

export class ChannelService {
  channelRepository: Repository<Channel>;
  constructor() {
    this.channelRepository = pgDataSource.getRepository(Channel);
    console.log("Initialized channel service new");
  }

  async createChannel(createChannelDto: CreateChannelDto) {
    const {
      categories: categoryIds,
      channel_id,
      tenant_id,
      ...others
    } = createChannelDto;

    const questionsQueue = await questionService.createQuestionsQueue(
      categoryIds
    );

    addScheduledDates(
      createChannelDto.time,
      createChannelDto.schedule,
      questionsQueue
    );

    let isSuccess = true;
    let channel = await this.channelRepository.create({
      ...others,
      slack_id: channel_id,
      tenantId: tenant_id,
      categories: categoryIds.map((categoryId) => ({ id: categoryId })),
      questionsQueue: questionsQueue,
    });

    channel = await this.channelRepository.save(channel).catch((err) => {
      console.error(err);
      isSuccess = false;
      return null;
    });

    return isSuccess ? channel : null;
  }

  async getChannelById(id: string) {
    let isSuccess = true;
    const channel = await this.channelRepository
      .findOne({
        where: { id },
        relations: {
          categories: true,
          tenant: true,
        },
      })
      .catch((e) => {
        console.error("Error: ", e.message);
        isSuccess = false;
      });
    return isSuccess ? channel : null;
  }

  async updateChannelName(id: string, name: string, slack_id: string) {
    const channel = await this.getChannelById(id);
    if (!channel) {
      return null;
    }
    const access_token = (await channel.tenant).access_token;
    // leave the channel
    await SlackService.leaveChannel(channel.slack_id, access_token);
    // stop the cron job
    cronService.stopCron(id);

    const res = await this.channelRepository.update(id, {
      name,
      slack_id,
    });
    if (res.affected == 0) {
      return null;
    }

    const newChannel = await this.getChannelById(id);

    if (!newChannel) {
      return null;
    }
    // join the channel
    await SlackService.joinChannel(newChannel.slack_id, access_token);
    // start the cron job
    cronService.setupCron(newChannel.id, newChannel.time, newChannel.schedule);

    return newChannel;
  }

  async restartAllCrons() {
    const channels = await this.channelRepository.find();
    channels.forEach((channel) => {
      cronService.setupCron(channel.id, channel.time, channel.schedule);
    });
  }

  async updateChannelCategories(id: string, categoryIds: string[]) {
    let channel = await this.getChannelById(id);
    if (!channel) {
      return null;
    }

    const questionsQueue = await questionService.createQuestionsQueue(
      categoryIds
    );
    addScheduledDates(channel.time, channel.schedule, questionsQueue);

    let isSuccess = true;
    channel = await this.channelRepository.create({
      ...channel,
      categories: categoryIds.map((categoryId) => ({ id: categoryId })),
      questionsQueue: questionsQueue,
    });

    channel = await this.channelRepository.save(channel).catch((err) => {
      console.error(err);
      isSuccess = false;
      return null;
    });

    return isSuccess ? channel : null;
  }

  updateQuestionsQueue = async (
    id: string,
    questionsQueue: QueuedQuestion[]
  ) => {
    const channel = await this.getChannelById(id);
    if (!channel) {
      return null;
    }
    const res = await this.channelRepository.update(id, {
      questionsQueue,
    });
    if (res.affected == 0) {
      return null;
    }
    return channel;
  };

  async updateChannelTimeAndSchedule(
    id: string,
    time: string,
    schedule: string
  ) {
    const channel = await this.getChannelById(id);
    if (!channel) {
      return null;
    }

    const res = await this.channelRepository.update(id, {
      time,
      schedule,
    });

    if (res.affected == 0) {
      return null;
    }

    cronService.updateTimeAndSchedule(id, time, schedule);

    return channel;
  }

  async refreshQueue(id: string) {
    const channel = await this.getChannelById(id);
    if (!channel) {
      return null;
    }
    const categoryIds = channel.categories.map((category) => category.id);

    // update the question to include the tenant
    const questionsQueue = channel.questionsQueue;
    const askedQuestion = questionsQueue.shift();
    if (!askedQuestion.isEdited) {
      await questionService.updateAnsweredBy(
        askedQuestion.id,
        (
          await channel.tenant
        ).id
      );
    }

    if (questionsQueue.length > 9) {
      this.updateQuestionsQueue(channel.id, questionsQueue);
      return;
    } else if (questionsQueue.length == 0) {
      await this.updateQuestionsQueue(channel.id, []);
      return;
    }

    const newQuestion: Question | null = await questionService.getNewQuestion(
      categoryIds,
      (
        await channel.tenant
      ).id,
      questionsQueue.map((question) => question.id)
    );

    if (!newQuestion) {
      await this.updateQuestionsQueue(channel.id, questionsQueue);
      return;
    }
    questionsQueue.push({
      ...newQuestion,
      date: new Date(),
    });

    addScheduledDates(channel.time, channel.schedule, questionsQueue);

    await this.updateQuestionsQueue(channel.id, questionsQueue);
  }

  async removeQuestionFromQueue(id: string, questionId: string) {
    const channel = await this.getChannelById(id);
    if (!channel) {
      return null;
    }
    const categoryIds = channel.categories.map((category) => category.id);
    const questionsQueue = channel.questionsQueue;
    const newQuestionsQueue = questionsQueue.filter(
      (question) => question.id !== questionId
    );

    const tenant = await channel.tenant;
    questionService.updateAnsweredBy(questionId, tenant.id);

    const newQuestion: Question | null = await questionService.getNewQuestion(
      categoryIds,
      tenant.id,
      newQuestionsQueue.map((question) => question.id)
    );

    if (!newQuestion) {
      await this.updateQuestionsQueue(channel.id, newQuestionsQueue);
      return;
    }

    newQuestionsQueue.push({
      ...newQuestion,
      date: new Date(),
    });

    addScheduledDates(channel.time, channel.schedule, newQuestionsQueue);

    const updatedChannel = await this.updateQuestionsQueue(
      channel.id,
      newQuestionsQueue
    );
    return updatedChannel;
  }

  async removeChannel(id: string) {
    const res = await this.channelRepository.delete(id);
    return res.affected > 0;
  }
}
