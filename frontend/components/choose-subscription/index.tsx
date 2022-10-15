import { Heading, Flex, Box } from "@chakra-ui/react";
import { Tenant } from "../../types/tenant";
import { PricingCard } from "../pricing-card";

interface ChooseSubscriptionProps {
  tenant: Tenant;
}

export const ChooseSubscription = ({ tenant }: ChooseSubscriptionProps) => {
  return (
    <Box>
      <Heading textAlign={"center"} fontSize="5xl">
        Choose your subscription
      </Heading>
      ;
      {
        <Flex p={25}>
          {/* <ActivePlan /> */}
          <PricingCard variant={"annual"} />
          <PricingCard variant={"monthly"} />
        </Flex>
      }
    </Box>
  );
};
