import { IsNotEmpty, IsString } from "class-validator";

export class DeleteQuestionFromQueueDto {
  @IsString()
  @IsNotEmpty()
  questionId: string;

  @IsString()
  @IsNotEmpty()
  channelId: string;
}
