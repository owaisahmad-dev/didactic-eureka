import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  UsingJoinColumnIsNotAllowedError,
} from "typeorm";
import { Channel } from "../channel/channel.entity";
import { Question } from "../question/question.entity";

@Entity()
export class Tenant {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  access_token: string;

  @Column({
    default: null,
    unique: true,
  })
  email: string;

  @Column()
  workspace_name: string;

  @Column({
    unique: true,
  })
  workspace_id: string;

  @Column()
  is_enterprise: boolean;

  @OneToMany((type) => Channel, (channel) => channel.tenant, {
    lazy: true,
    cascade: true,
  })
  channels: Promise<Channel[]>;

  @Column()
  bot_user_id: string;

  @Column()
  user_slack_id: string;

  @ManyToMany(() => Question, {
    nullable: true,
    onDelete: "CASCADE",
    cascade: true,
  })
  answered_questions: Promise<Question[]>;

  @Column({
    default: true,
  })
  is_enabled: boolean;


  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
