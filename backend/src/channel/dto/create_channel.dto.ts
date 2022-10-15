import {
  IsArray,
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsString,
} from "class-validator";

export class CreateChannelDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  channel_id!: string;

  @IsArray()
  @IsNotEmpty()
  categories: string[];

  @IsString()
  @IsNotEmpty()
  schedule: string;

  @IsDateString()
  @IsNotEmpty()
  time: string;

  @IsString()
  @IsNotEmpty()
  tenant_id: string;
}
