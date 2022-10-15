import { Flex, Heading, Text } from "@chakra-ui/react";
import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "../components/navbar";

const Home: NextPage = () => {
  return (
    <div>
      <Navbar></Navbar>
      <Flex mt={20}>
        <Flex
          direction="column"
          alignItems={"center"}
          flex={1}
          p={25}
          borderRightWidth={1}
          borderRightColor="gray.400"
        >
          <Text mb={10} fontSize={"2xl"} textAlign="center">
            If you haven&apos;t yet added the app to Slack, click on Add to
            Slack to get started!
          </Text>
          <Link
            href={`https://slack.com/oauth/v2/authorize?client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}&scope=channels:join,chat:write,im:history,channels:history,channels:manage,channels:read,groups:read,im:write,users:read.email,users:read&user_scope=identity.basic`}
            passHref
          >
            <a>
              <Image
                alt="Add to Slack"
                height="40"
                width="139"
                src="https://platform.slack-edge.com/img/add_to_slack.png"
              />
            </a>
          </Link>
        </Flex>
        <Flex direction={"column"} alignItems={"center"} flex={1} p={25}>
          <Text mb={10} fontSize={"2xl"} textAlign="center">
            If you already are registered with Work Besties Bot, sign in with
            slack to access dashboard
          </Text>
          <Link
            href={`https://slack.com/openid/connect/authorize?scope=openid&amp;response_type=code&amp;redirect_uri=${encodeURIComponent(
              process.env.NEXT_PUBLIC_SLACK_REDIRECT_URI_LOGIN as string
            )}&amp;client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}`}
            passHref
          >
            <a>
              <Image
                alt="Sign in with Slack"
                height="40"
                width="139"
                src="https://platform.slack-edge.com/img/sign_in_with_slack@2x.png"
              />
            </a>
          </Link>
        </Flex>
      </Flex>
    </div>
  );
};

export default Home;
