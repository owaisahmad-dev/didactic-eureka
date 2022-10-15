import { createColumnHelper, FilterFn } from "@tanstack/react-table";
import { rankItem } from "@tanstack/match-sorter-utils";
import { Tenant } from "../types/tenant";

export const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({ itemRank: itemRank });
  return itemRank.passed;
};

export interface TenantData {
  email: string;
  workspace: string;
  plan: string;
  trial_end_date: string;
  enabled: boolean;
  delete: boolean;
  details: boolean;
}

const columnHelper = createColumnHelper<TenantData>();
export const columns = [
  columnHelper.accessor("email", {
    header: () => "Email",
  }),
  columnHelper.accessor("workspace", {
    header: () => "Workspace",
  }),
  columnHelper.accessor("plan", {
    header: () => "Plan",
  }),
  columnHelper.accessor("trial_end_date", {
    header: () => "Trial End Date",
  }),
  columnHelper.accessor("enabled", {
    header: () => "Enabled",
  }),
  columnHelper.accessor("delete", {
    header: () => "Delete",
  }),
  columnHelper.accessor("details", {
    header: () => "",
  }),
];

export const convertTenantsToRow = (tenants: Tenant[]): TenantData[] => {
  if (!tenants) {
    return [];
  }
  const data: TenantData[] = tenants.map((tenant) => {
    return {
      email: tenant.email,
      workspace: tenant.workspace_name,
      plan: tenant.is_trial ? "Trial" : tenant.is_paid_plan ? "Paid" : "Free",
      trial_end_date: new Date(tenant.trial_end_date).toDateString(),
      enabled: tenant.is_enabled,
      delete: true,
      details: true,
    };
  });

  return data;
};
