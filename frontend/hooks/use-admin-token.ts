import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const useAdminToken = () => {
  const [adminToken, setAdminToken] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      setAdminToken(token);
    } else {
      router.push("/");
    }
  }, []);

  return adminToken;
};
export { useAdminToken };
