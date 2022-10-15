import {
  IsBoolean,
  IsNotEmpty,
  IsNotEmptyObject,
  IsString,
} from "class-validator";
import { Tenant } from "../tenant.entity";

export class UpdateTenantDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsNotEmptyObject()
  updateObject: Partial<Tenant>;
}
