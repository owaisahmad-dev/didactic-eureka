import { QueuedQuestions } from "./question";

export interface UpdateChannelQuestionsQueueDto {
  id: string;
  questionsQueue: QueuedQuestions[];
}
