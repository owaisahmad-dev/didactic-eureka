import { useQuery } from "@tanstack/react-query";
import { BotApiClient } from "../components/axios";
import { Tenant } from "../types/tenant";

export const useAllTenant = () => {
  const fetchAllTenant = () => {
    return BotApiClient.get<Tenant[]>(`/tenant`).then((res) => res.data);
  };
  return useQuery([`tenants`], () => fetchAllTenant());
};
