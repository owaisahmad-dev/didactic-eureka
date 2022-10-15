import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Channel } from "../channel/channel.entity";
import { Question } from "../question/question.entity";
import { Tenant } from "../tenant/tenant.entity";

@Entity()
export class Category {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToMany(() => Question, (question) => question.categories, {
    lazy: true,
    onDelete: "CASCADE",
    cascade: true,
  })
  questions: Promise<Question[]>;

  @ManyToMany(() => Channel, (channel) => channel.categories, {
    lazy: true,
    onDelete: "CASCADE",
    cascade: true,
  })
  channels: Promise<Channel[]>;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
