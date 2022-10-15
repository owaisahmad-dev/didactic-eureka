import { useEffect, useState } from "react";
import jwt from "jwt-decode";
import { Tenant } from "../types/tenant";
import { useRouter } from "next/router";

const useToken = () => {
  const [tenantId, setTenantId] = useState("");
  const [token, setToken] = useState("");
  const router = useRouter();

  const decodeToken = (token: string) => {
    const decoded: any = jwt(token);
    const tenant: Tenant = decoded.tenant;
    setTenantId(tenant.id);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setToken(token);
    } else {
      router.push("/");
    }
  }, []);

  useEffect(() => {
    if (token) {
      decodeToken(token);
    }
  }, [token]);

  return { tenantId, token };
};
export { useToken };
