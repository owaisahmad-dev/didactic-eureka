import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class UpdateChannelCategoriesDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  categories: string[];
}
