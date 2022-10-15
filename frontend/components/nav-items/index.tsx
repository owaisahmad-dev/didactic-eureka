import { UnorderedList, ListItem, Select, Box, Button } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTenant } from "../../hooks/use-tenant";
import { useToken } from "../../hooks/use-token";

export const NavItems = () => {
  const { tenantId } = useToken();
  const { data: tenant } = useTenant(tenantId);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <Box>
      <UnorderedList styleType={"none"} m={0} p={0}>
        <ListItem color={"white"} display={"inline-block"} p={2}>
          <Link href="/billing">Billing</Link>
        </ListItem>
        <ListItem color={"white"} display={"inline-block"} p={2}>
          <Link href="/help">Help</Link>
        </ListItem>
        {tenant && (
          <ListItem color={"white"} display={"inline-block"} p={2}>
            <Button
              variant={"ghost"}
              _hover={{
                backgroundColor: "white",
                color: "black",
              }}
              onClick={() => handleLogout()}
            >
              {`(${tenant.workspace_name})`} Logout
            </Button>
          </ListItem>
        )}
      </UnorderedList>
    </Box>
  );
};
