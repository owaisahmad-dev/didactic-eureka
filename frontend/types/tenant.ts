import { Channel } from "./channel";

export interface Tenant {
  id: string;
  access_token: string;
  email: string;
  workspace_name: string;
  workspace_id: string;
  is_enterprise: boolean;
  __channels__: Channel[];
  bot_user_id: string;
  user_slack_id: string;
  is_enabled: boolean;
  subscription_type: string;
  subscription_start_date: Date;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  createdAt: Date;
  updatedAt: Date;
}
