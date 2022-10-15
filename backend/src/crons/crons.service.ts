import { CronJob } from "cron";
import { channelService } from "../channel/channel.controller";
import { Channel } from "../channel/channel.entity";
import { SlackService } from "../slack/slack.service";
import { create_groups_dto } from "../utils/create_groups_dto";

type Jobs = {
  [key: string]: CronJob;
};

const cronPatternsDict = (minutes: number, hours: number) => ({
  Weekends: `${minutes} ${hours} * * 6-0`,
  Weekdays: `${minutes} ${hours} * * 1-5`,
  Everyday: `${minutes} ${hours} * * *`,
  "Every Monday": `${minutes} ${hours} * * 1`,
  "Every Tuesday": `${minutes} ${hours} * * 2`,
  "Every Wednesday": `${minutes} ${hours} * * 3`,
  "Every Thursday": `${minutes} ${hours} * * 4`,
  "Every Friday": `${minutes} ${hours} * * 5`,
  "Every Saturday": `${minutes} ${hours} * * 6`,
  "Every Sunday": `${minutes} ${hours} * * 0`,
});

export class CronsService {
  jobs: Jobs;
  constructor() {
    this.jobs = {};
  }

  async setupCron(id: string, time: string, schedule: string) {
    const dateTime = new Date(time);

    const minutes = dateTime.getMinutes();
    const hours = dateTime.getHours();

    const cronPattern = cronPatternsDict(minutes, hours)[schedule];
    // set cron patter to run every minute
    // const cronPattern = "* * * * *";
    const cron = new CronJob(cronPattern, () => this.sendMessage(id));

    cron.start();
    this.jobs[id] = cron;
  }

  async sendMessage(channelId: string) {
    console.log(`Send message to channel with id: ${channelId}`);
    const channel = await channelService.getChannelById(channelId);
    if (!channel) {
      console.error("Message sending failed, channel not found");
      return;
    }
    const questionsQueue = channel.questionsQueue;
    const question = questionsQueue.shift();
    if (!question) {
      await SlackService.sendMessage(
        channel.slack_id,
        "I don't have any more questions for you today",
        (await channel.tenant).access_token
      );
      return;
    }

    const {ts} = await SlackService.sendMessage(
      channel.slack_id,
      question.text,
      (await channel.tenant).access_token
    );

    setTimeout(async () => {
      const {originalMessage, replies} = await SlackService.getThread(channel.slack_id, ts, (await channel.tenant).access_token);
      const dto = create_groups_dto(originalMessage, replies);
      // TODO send this DTO to ML API
    }, 1000 * 60);
    return;

    await channelService.refreshQueue(channelId);
  }

  stopCron(channelId: string) {
    const cron = this.jobs[channelId];
    cron.stop();
    delete this.jobs[channelId];
  }

  updateTimeAndSchedule(channelId: string, time: string, schedule: string) {
    this.stopCron(channelId);
    this.setupCron(channelId, time, schedule);
  }
}