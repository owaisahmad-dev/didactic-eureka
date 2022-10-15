import { IsNotEmpty, IsString } from "class-validator";

export class CreateSubscriptionDto {
  @IsString()
  @IsNotEmpty()
  tenantId: string;

  @IsString()
  @IsNotEmpty()
  priceId: string;
}
