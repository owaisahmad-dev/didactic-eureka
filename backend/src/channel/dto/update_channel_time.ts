import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class UpdateChannelTime {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  time: string;

  @IsString()
  @IsNotEmpty()
  schedule: string;
}
