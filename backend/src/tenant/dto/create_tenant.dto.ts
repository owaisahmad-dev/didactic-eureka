import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateTenantDto {
  @IsString()
  @IsNotEmpty()
  access_token!: string;

  @IsString()
  @IsNotEmpty()
  user_slack_id!: string;

  @IsString()
  @IsNotEmpty()
  bot_user_id!: string;

  @IsString()
  @IsNotEmpty()
  workspace_id!: string;

  @IsString()
  @IsNotEmpty()
  workspace_name!: string;

  @IsBoolean()
  is_enterprise!: boolean;

  @IsOptional()
  email: string;
}
