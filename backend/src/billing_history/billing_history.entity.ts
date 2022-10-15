import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Tenant } from "../tenant/tenant.entity";

@Entity()
export class BillingHistory {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne((type) => Tenant, (tenant) => tenant.billingHistory, {
    lazy: true,
  })
  tenant: Promise<Tenant>;

  @Column()
  amount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
