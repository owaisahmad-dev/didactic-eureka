import { Flex, Heading, Text } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ActivePlan } from "../components/active-plan";
import { ChooseSubscription } from "../components/choose-subscription";
import { NavItems } from "../components/nav-items";
import { Navbar } from "../components/navbar";
import { PricingCard } from "../components/pricing-card";
import { useTenant } from "../hooks/use-tenant";
import { useToken } from "../hooks/use-token";

const Home: NextPage = () => {
  const router = useRouter();
  const { tenantId } = useToken();
  const { data: tenant } = useTenant(tenantId);

  return (
    <div>
      <Navbar>
        <NavItems />
      </Navbar>
      <Flex
        mt={20}
        justifyContent={"center"}
        alignItems={"center"}
        flexDirection="column"
      >
        {tenant && !tenant.is_paid_plan && (
          <ChooseSubscription tenant={tenant} />
        )}
        {tenant && tenant.is_paid_plan && <ActivePlan tenant={tenant} />}
      </Flex>
    </div>
  );
};

export default Home;
