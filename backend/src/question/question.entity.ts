import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Category } from "../category/category.entity";
import { Tenant } from "../tenant/tenant.entity";

@Entity()
export class Question {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  text: string;

  @Column({
    nullable: true,
  })
  image_url: string;

  @ManyToMany((type) => Category, (category) => category.questions, {
    lazy: true,
  })
  @JoinTable({
    name: "questions_categories",
  })
  categories: Category[];

  @ManyToMany((type) => Tenant, (tenant) => tenant.answered_questions, {})
  @JoinTable({
    name: "answered_questions",
  })
  answered_by: Tenant[];

  @Column({ default: false })
  isEdited: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
