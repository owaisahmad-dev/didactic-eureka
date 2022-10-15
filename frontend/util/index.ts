import { CreateTenantDto } from "../types/create_tenant.dto";

export const createTenantPayload = (data: any): CreateTenantDto => {
  return {
    access_token: data.access_token,
    user_slack_id: data.authed_user.id,
    bot_user_id: data.bot_user_id,
    workspace_id: data.team.id,
    workspace_name: data.team.name,
    is_enterprise: data.is_enterprise_install,
  };
};
