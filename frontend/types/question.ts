import { Category } from "./category";

export interface Question {
  id: string;
  text: string;
  image_url: string;
  categories: Promise<Category[]>;

  createdAt: Date;

  updatedAt: Date;
  __categories__: Category[];
}

export interface QueuedQuestions {
  date: string;
  id: string;
  text: string;
  image_url?: string;
  isEdited: boolean;
  __categories__: Category[];
}
