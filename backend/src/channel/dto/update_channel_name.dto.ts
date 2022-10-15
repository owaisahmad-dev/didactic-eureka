import { IsNotEmpty, IsString } from "class-validator";

export class UpdateChannelNameDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  slack_id: string;
}
