import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsOptional()
  image_url: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  categoryIds: string[];
}
