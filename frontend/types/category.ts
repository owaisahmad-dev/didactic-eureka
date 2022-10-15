import { Question } from "./question";
import { Tenant } from "./tenant";

export interface Category {
  id: string;
  tenants: Promise<Tenant[]>;
  questions: Promise<Question[]>;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
