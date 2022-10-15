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
import { BillingHistory } from "../billing_history/billing_history.entity";
import { Category } from "../category/category.entity";
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

  @Column({
    default: false,
  })
  is_paid_plan: boolean;

  @OneToMany(
    (type) => BillingHistory,
    (billingHistory) => billingHistory.tenant,
    {
      lazy: true,
      cascade: true,
    }
  )
  billingHistory: Promise<BillingHistory[]>;

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
  is_trial: boolean;

  @Column()
  trial_end_date: Date;

  @Column({
    default: true,
  })
  is_enabled: boolean;

  @Column({
    nullable: true,
  })
  subscription_type: string;

  @Column({
    nullable: true,
  })
  stripe_customer_id: string;

  @Column({
    nullable: true,
  })
  stripe_subscription_id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
