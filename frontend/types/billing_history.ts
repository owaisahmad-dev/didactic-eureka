import { Tenant } from "./tenant";

export interface BillingHistory {
  id: string;
  tenant: Promise<Tenant>;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}
