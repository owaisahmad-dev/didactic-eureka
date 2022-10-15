import { Button, Flex, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { AdminLogin } from "../../components/admin-login";
import { Navbar } from "../../components/navbar";

const AdminPage: NextPage = () => {
  const router = useRouter();

  return (
    <>
      <Navbar>
        <Text fontSize={"xl"} color={"white"}>
          Admin Console
        </Text>
      </Navbar>
      <Flex justifyContent={"center"} alignItems="center" m={10} p={15}>
        <AdminLogin />
      </Flex>
    </>
  );
};

export default AdminPage;
