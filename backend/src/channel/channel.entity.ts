import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Category } from "../category/category.entity";
import { Question } from "../question/question.entity";
import { Tenant } from "../tenant/tenant.entity";

export interface QueuedQuestion extends Question {
  date: Date;
}

@Entity()
export class Channel {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  slack_id: string;

  @JoinColumn()
  @ManyToOne((type) => Tenant, (tenant) => tenant.channels, {
    lazy: true,
    onDelete: "CASCADE",
  })
  tenant: Promise<Tenant>;

  @Column()
  tenantId: string;

  @Column({
    nullable: true,
    default: null,
  })
  schedule: string;

  @Column({
    nullable: true,
    default: null,
  })
  time: string;

  @ManyToMany(() => Category, (category) => category.channels, {})
  @JoinTable({
    name: "channels_categories",
  })
  categories!: Array<Category>;

  @Column("jsonb", { array: false, default: () => "'[]'", nullable: false })
  questionsQueue: Array<QueuedQuestion>;

  @CreateDateColumn({})
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
