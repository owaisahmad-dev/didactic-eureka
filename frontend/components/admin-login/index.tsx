import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { BotApiClient } from "../axios";

export const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleAdminLogin = async () => {
    console.log(username, password);
    const response = await BotApiClient.post<{ token: string }>(
      "/admin/login",
      {
        username,
        password,
      }
    ).catch((err) => {
      console.warn(err.response.data);
    });

    if (!response) return;
    const { token } = response.data;
    localStorage.setItem("adminToken", token);
    router.push("/admin/dashboard");
  };

  return (
    <Flex
      flexDir={"column"}
      backgroundColor="whiteAlpha.300"
      p={10}
      border="1px solid #e6e6e6"
      borderRadius={20}
      boxShadow="md"
      m={10}
      alignItems="center"
    >
      <Heading mb={5}>Admin Login</Heading>
      <FormControl mt={3}>
        <FormLabel>Username</FormLabel>
        <Input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </FormControl>
      <FormControl mt={3}>
        <FormLabel>Password</FormLabel>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormControl>

      <Button mt={10} colorScheme="yellow" onClick={handleAdminLogin}>
        Submit
      </Button>
    </Flex>
  );
};
