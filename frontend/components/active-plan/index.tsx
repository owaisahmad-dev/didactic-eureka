import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { Stripe } from "@stripe/stripe-js";
import Router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useToken } from "../../hooks/use-token";
import { Tenant } from "../../types/tenant";
import { getStripe } from "../../util/get_stripe";
import { BotApiClient } from "../axios";
import { ANNUAL_PRICE_ID } from "../pricing-card";

interface ActivePlanProps {
  tenant: Tenant;
}

export const ActivePlan = ({ tenant }: ActivePlanProps) => {
  const subscriptionType =
    tenant.subscription_type === ANNUAL_PRICE_ID ? "annual" : "monthly";

  const price = subscriptionType === "annual" ? 184 : 15;

  const [nextBillingDate, setNextBillingDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { tenantId, token } = useToken();

  const router = useRouter();

  const getNextBillingDate = async () => {
    const billingDateString = await BotApiClient.get(
      `/payment/${tenant.id}/next-billing-data`,
      {
        headers: {
          "x-auth-token": token,
        },
      }
    );
    setNextBillingDate(new Date(billingDateString.data.nextBillingDate));
  };

  const cancelSubscription = async () => {
    setIsLoading(true);
    await BotApiClient.delete(`/payment/${tenant.stripe_subscription_id}`, {
      headers: {
        "x-auth-token": token,
      },
    });
    router.reload();
  };

  useEffect(() => {
    getNextBillingDate();
  }, []);

  return (
    <Flex
      flexDir={"column"}
      backgroundColor="whiteAlpha.300"
      p={10}
      border="1px solid #e6e6e6"
      borderRadius={20}
      boxShadow="md"
    >
      <Box textAlign={"center"}>
        <Badge colorScheme={"green"}>Active Plan</Badge>
      </Box>
      <Heading textAlign={"center"}>
        {subscriptionType === "annual" ? "Annual Plan" : "Monthly Plan"}
      </Heading>
      <Text fontSize={"6xl"} color="#bbb" textAlign={"center"}>
        {`$${price}`}
      </Text>
      <Text textAlign={"center"}>per channel</Text>
      <Heading mt={5} textAlign={"center"} size={"sm"}>
        Next payment due on
      </Heading>
      <Text textAlign={"center"}>
        {nextBillingDate ? nextBillingDate.toDateString() : "--/--/----"}
      </Text>
      <Heading mt={5} textAlign={"center"} size={"sm"}>
        Amount Due
      </Heading>
      <Text textAlign={"center"}>{`$${price * tenant.__channels__.length} for ${
        tenant.__channels__.length
      } ${
        tenant.__channels__.length > 1 ? "channels" : "channel"
      } active.`}</Text>

      <Heading mt={5} textAlign={"center"} size={"sm"}>
        {`Active Channel(s)`}
      </Heading>
      {tenant.__channels__.map((channel, index) => (
        <Text key={index} textAlign={"center"} color="#888" fontWeight="bolder">
          #{channel.name}
        </Text>
      ))}
      <Button
        isLoading={isLoading}
        spinner={<Spinner />}
        mt={5}
        variant={"ghost"}
        colorScheme="red"
        onClick={cancelSubscription}
      >
        Cancel Subscription
      </Button>
    </Flex>
  );
};
