import { Flex, Heading, Text } from "@chakra-ui/react";
import { OauthAccessResponse, OauthV2AccessResponse } from "@slack/web-api";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BotApiClient, NextApiClient } from "../components/axios";
import { Navbar } from "../components/navbar";
import { Tenant } from "../types/tenant";

const Home: NextPage = () => {
  const router = useRouter();
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);

  const getAccessToken = async () => {
    console.log(router.query.code);
    const response: OauthV2AccessResponse | void = await NextApiClient.post(
      "exchange",
      {
        code: router.query.code,
        redirect_uri: process.env
          .NEXT_PUBLIC_SLACK_REDIRECT_URI_LOGIN as string,
      }
    )
      .then((res) => res.data.response)
      .catch((err) => {
        console.error(err.response.data);
      });
    if (!response || !response.ok) {
      router.push("/error");
      return;
    }
    if (response.team?.id) {
      console.log(response);
      setWorkspaceId(response.team?.id);
    }
  };

  const attemptLogin = async (workspaceId: string) => {
    const response = await BotApiClient.post<{ token: string }>(
      "/tenant/login",
      {
        workspaceId,
      }
    ).catch((err) => {
      console.error(err.response.data);
    });

    if (!response) return;
    console.log(response);
    const { token } = response.data;
    localStorage.setItem("token", token);

    router.push("/dashboard");
  };

  useEffect(() => {
    if (router.query.code) {
      getAccessToken();
    }
  }, [router, router.query]);

  useEffect(() => {
    if (!workspaceId) {
      return;
    }

    attemptLogin(workspaceId);
  }, [workspaceId]);

  return (
    <div>
      <Navbar></Navbar>
      <Flex mt={20} justifyContent={"center"} alignItems={"center"}>
        <Heading>Redirecting...</Heading>
      </Flex>
    </div>
  );
};

export default Home;
