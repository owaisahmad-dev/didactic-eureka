import { IsArray, IsNotEmpty, IsString } from "class-validator";
import { QueuedQuestion } from "../channel.entity";

export class UpdateChannelQuestionsQueueDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsArray()
  @IsNotEmpty()
  questionsQueue: QueuedQuestion[];
}
