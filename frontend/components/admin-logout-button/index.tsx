import { Button } from "@chakra-ui/react";
import { useRouter } from "next/router";

export const AdminLogoutButton = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push("/admin");
  };
  return (
    <Button
      variant={"ghost"}
      _hover={{
        backgroundColor: "white",
        color: "black",
      }}
      color={"white"}
      onClick={() => handleLogout()}
    >
      Logout
    </Button>
  );
};
