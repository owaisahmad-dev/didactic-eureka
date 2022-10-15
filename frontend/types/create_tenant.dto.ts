export interface CreateTenantDto {
  access_token: string;
  user_slack_id: string;
  bot_user_id: string;

  workspace_id: string;

  workspace_name: string;

  is_enterprise: boolean;
}
