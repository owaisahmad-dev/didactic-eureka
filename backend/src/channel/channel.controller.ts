import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";
import { Request, Response, Router } from "express";
import { TypedRequestBody } from "../../types";
import { CronsService } from "../crons/crons.service";
import { SlackService } from "../slack/slack.service";
import { tenantService } from "../tenant/tenant.controller";
import { ChannelService } from "./channel.service";
import { CreateChannelDto } from "./dto/create_channel.dto";
import { DeleteQuestionFromQueueDto } from "./dto/delete_question_from_queue";
import { UpdateChannelCategoriesDto } from "./dto/update_channel_categories";
import { UpdateChannelNameDto } from "./dto/update_channel_name.dto";
import { UpdateChannelQuestionsQueueDto } from "./dto/update_channel_questions_queue";
import { UpdateChannelTime } from "./dto/update_channel_time";
import * as express from "express";
import { paymentService } from "../payment/payment.service";
import { authMiddleware } from "../middlewares/auth";

const channelController = Router();
const channelService = new ChannelService();
const cronService = new CronsService();
channelController.use(express.json());
channelController.use(authMiddleware);

channelController.post(
  "/add",
  async (req: TypedRequestBody<CreateChannelDto>, res: Response) => {
    const dto = req.body;
    const errors = validateSync(plainToInstance(CreateChannelDto, dto));

    if (errors.length > 0) {
      return res.status(400).send({ message: "Invalid request body" });
    }
    const channel = await channelService.createChannel(dto);
    if (!channel) {
      return res.status(500).send({ error: "Failed to add channel" });
    }
    const tenantId = channel.tenantId;
    const updatedTenant = await tenantService.findTenantById(tenantId);

    if (updatedTenant.is_paid_plan) {
      await paymentService.updateStripeSubscription(updatedTenant);
    }

    // join the channel in slack
    await SlackService.joinChannel(
      channel.slack_id,
      updatedTenant.access_token
    );

    // setup cron job to send messages to channel
    cronService.setupCron(channel.id, channel.time, channel.schedule);

    return res.status(201).send(updatedTenant);
  }
);

channelController.get("/", async (req: Request, res: Response) => {
  // get channel id from query params
  const channelId = req.query.id;
  const channel = await channelService.getChannelById(channelId as string);

  if (!channel) {
    return res.status(404).send({ error: "Channel not found" });
  }

  return res.status(200).send(channel);
});

channelController.put(
  "/name",
  async (req: TypedRequestBody<UpdateChannelNameDto>, res: Response) => {
    const dto = req.body;
    const errors = validateSync(plainToInstance(UpdateChannelNameDto, dto));

    if (errors.length > 0) {
      return res.status(400).send({ message: "Invalid request body" });
    }

    const { id, slack_id, name } = dto;
    const updatedChannel = await channelService.updateChannelName(
      id,
      name,
      slack_id
    );
    if (!updatedChannel) {
      return res.status(500).send({ error: "Failed to update channel" });
    }
    const tenant = await tenantService.findTenantById(updatedChannel.tenantId);
    return res.status(200).send(tenant);
  }
);

channelController.put(
  "/categories",
  async (req: TypedRequestBody<UpdateChannelCategoriesDto>, res: Response) => {
    const dto = req.body;
    const errors = validateSync(
      plainToInstance(UpdateChannelCategoriesDto, dto)
    );

    if (errors.length > 0) {
      return res.status(400).send({ message: "Invalid request body" });
    }

    const { id, categories } = dto;
    const updatedChannel = await channelService.updateChannelCategories(
      id,
      categories
    );
    if (!updatedChannel) {
      return res.status(500).send({ error: "Failed to update channel" });
    }
    const tenant = await tenantService.findTenantById(updatedChannel.tenantId);
    return res.status(200).send(tenant);
  }
);

channelController.put(
  "/questions",
  async (
    req: TypedRequestBody<UpdateChannelQuestionsQueueDto>,
    res: Response
  ) => {
    const dto = req.body;
    const errors = validateSync(
      plainToInstance(UpdateChannelQuestionsQueueDto, dto)
    );

    if (errors.length > 0) {
      return res.status(400).send({ message: "Invalid request body" });
    }

    const { id, questionsQueue } = dto;
    const updatedChannel = await channelService.updateQuestionsQueue(
      id,
      questionsQueue
    );

    if (!updatedChannel) {
      return res.status(500).send({ error: "Failed to update channel" });
    }
    const tenant = await tenantService.findTenantById(updatedChannel.tenantId);
    return res.status(200).send(tenant);
  }
);

channelController.put(
  "/time",
  async (req: TypedRequestBody<UpdateChannelTime>, res: Response) => {
    const dto = req.body;
    const errors = validateSync(plainToInstance(UpdateChannelTime, dto));

    if (errors.length > 0) {
      return res.status(400).send({ message: "Invalid request body" });
    }

    const { id, time, schedule } = dto;
    const updatedChannel = await channelService.updateChannelTimeAndSchedule(
      id,
      time,
      schedule
    );
    if (!updatedChannel) {
      return res.status(500).send({ error: "Failed to update channel" });
    }
    const tenant = await tenantService.findTenantById(updatedChannel.tenantId);
    return res.status(200).send(tenant);
  }
);

channelController.put(
  "/question",
  async (req: TypedRequestBody<DeleteQuestionFromQueueDto>, res: Response) => {
    const dto = req.body;
    const errors = validateSync(
      plainToInstance(DeleteQuestionFromQueueDto, dto)
    );

    if (errors.length > 0) {
      return res.status(400).send({ message: "Invalid request body" });
    }

    const { channelId, questionId } = dto;
    const updatedChannel = await channelService.removeQuestionFromQueue(
      channelId,
      questionId
    );
    if (!updatedChannel) {
      return res.status(500).send({ error: "Failed to update channel" });
    }
    const tenant = await tenantService.findTenantById(updatedChannel.tenantId);
    return res.status(200).send(tenant);
  }
);

channelController.delete("/", async (req: Request, res: Response) => {
  // get channel id from query params
  const channelId = req.query.id as string;
  if (!channelId) {
    return res.status(400).send({ error: "Channel id is required" });
  }

  const channel = await channelService.getChannelById(channelId as string);
  if (!channel) {
    return res.status(404).send({ error: "Channel not found" });
  }

  // delete channel from db
  if (!channelService.removeChannel(channelId as string)) {
    return res.status(500).send({ error: "Failed to delete channel" });
  }

  // delete cron job
  cronService.stopCron(channelId as string);

  // leave channel in slack
  await SlackService.leaveChannel(
    channel.slack_id,
    (
      await channel.tenant
    ).access_token
  );

  const tenant = await tenantService.findTenantById(channel.tenantId);
  if (tenant.is_paid_plan)
    await paymentService.updateStripeSubscription(tenant);

  return res.status(200).send({ message: "Channel deleted" });
});

export default channelController;
export { channelService, cronService };
