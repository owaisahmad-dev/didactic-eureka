import { useQuery } from "@tanstack/react-query";
import { BotApiClient } from "../components/axios";
import { Tenant } from "../types/tenant";
import { useToken } from "./use-token";

export const useTenant = (tenantId: string) => {
  const { token } = useToken();

  const fetchTenant = (tenantId: string) => {
    return BotApiClient.get<Tenant>(`/tenant?id=${tenantId}`).then(
      (res) => res.data
    );
  };
  return useQuery([`tenant-${tenantId}`], () => fetchTenant(tenantId), {
    enabled: !!tenantId && !!token,
  });
};
