export interface ChannelSettingsDto {
  channel_name: string;
  channel_id: string;
}

export interface ScheduleSettingsDto {
  schedule: string;
  time: string;
}

export interface CreateChannelDto {
  name: string;
  channel_id: string;
  categories: string[];
  schedule: string;
  time: string;
  tenant_id: string;
}
