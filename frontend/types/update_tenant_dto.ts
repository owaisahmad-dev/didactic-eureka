import { Tenant } from "./tenant";

export interface UpdateTenantDto {
  id: string;
  updateObject: Partial<Tenant>;
  removeStripeCred?: boolean;
}
