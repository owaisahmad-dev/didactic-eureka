import { AddIcon } from "@chakra-ui/icons";
import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTenant } from "../../hooks/use-tenant";
import { useToken } from "../../hooks/use-token";

const Sidebar = () => {
  const router = useRouter();
  const { tenantId } = useToken();
  const { data: tenant } = useTenant(tenantId ? tenantId : "");
  return (
    <Box minHeight={"85vh"} height={"100%"} backgroundColor={"#fafafa"} py={10}>
      <Heading size="lg" mx={5} mr={10} mb={5}>
        Bot Channels
      </Heading>
      {tenant &&
        tenant.__channels__.map((c, i) => (
          <Box mb={2} key={i}>
            <Text
              ml={5}
              backgroundColor="gray.100"
              display={"inline-block"}
              _hover={{
                cursor: "pointer",
              }}
              p={1}
              borderRadius={10}
            >
              {`#${c.name}`}
            </Text>
          </Box>
        ))}
      {/* Divider */}
      <Box border={"1px solid #000"} my={10}></Box>

      <Button
        ml={5}
        variant="ghost"
        colorScheme={"teal"}
        leftIcon={<AddIcon />}
        onClick={() => router.push("/onboarding")}
      >
        Add a channel
      </Button>
    </Box>
  );
};

export { Sidebar };
