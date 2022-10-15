import { CheckCircleIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Icon,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useToken } from "../../hooks/use-token";
import { BotApiClient } from "../axios";

interface PricingCardProps {
  variant: "annual" | "monthly";
}

export const ANNUAL_PRICE_ID = "price_1LSlj9F3MD33K1ymSCPeKz50";
export const MONTHLY_PRICE_ID = "price_1LSljfF3MD33K1ymp0LPtfEO";

export const PricingCard = ({ variant }: PricingCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { token, tenantId } = useToken();

  const choosePlan = async () => {
    const stripePriceId =
      variant === "annual" ? ANNUAL_PRICE_ID : MONTHLY_PRICE_ID;

    setIsLoading(true);
    const res = await BotApiClient.post(
      "/payment/create-subscription",
      {
        tenantId,
        priceId: stripePriceId,
        subscriptionType: variant,
      },
      {
        headers: {
          "x-auth-token": token,
        },
      }
    );
    const { clientSecret } = res.data;
    if (!clientSecret) {
      console.log("Fail to choose plan");
      return;
    }
    localStorage.setItem("clientSecret", clientSecret);
    router.push("/payment");
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
    >
      <Heading textAlign={"center"}>
        {variant === "annual" ? "Annually" : "Monthly"}
      </Heading>
      <Text fontSize={"6xl"} color="#bbb" textAlign={"center"}>
        {variant === "annual" ? "$184" : "$15"}
      </Text>
      <Text textAlign={"center"}>per channel</Text>
      <HStack justifyContent={"center"}>
        <CheckCircleIcon color={"green"} />
        <Text>{variant === "monthly" ? "cancel anytime" : "20% off"}</Text>
      </HStack>

      <Button
        isLoading={isLoading}
        spinner={<Spinner />}
        spinnerPlacement="start"
        mt={5}
        variant={"solid"}
        colorScheme="green"
        onClick={choosePlan}
      >
        Choose this plan
      </Button>
    </Flex>
  );
};
