import { IsString, IsNotEmpty, IsArray } from "class-validator";

export class UpdateQuestionDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsString()
  @IsNotEmpty()
  text: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  categoryIds: string[];
}
