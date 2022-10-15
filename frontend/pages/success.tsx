import { Text, Flex, Heading, VStack, Button } from "@chakra-ui/react";
import { Stripe } from "@stripe/stripe-js";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { NavItems } from "../components/nav-items";
import { Navbar } from "../components/navbar";
import { getStripe } from "../util/get_stripe";

const Success: NextPage = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [stripe, setStripe] = useState<Stripe | "">("");
  const [tenantId, setTenantId] = useState("");

  const router = useRouter();
  const { payment_intent_client_secret: clientSecret } = router.query;

  const initStripe = async () => {
    const stripe = await getStripe();
    if (stripe) setStripe(stripe);
  };
  const retrievePaymentIntent = async (
    stripe: Stripe,
    clientSecret: string
  ) => {
    stripe
      .retrievePaymentIntent(clientSecret)
      .then((res) => res.paymentIntent)
      .then((paymentIntent) => {
        if (!paymentIntent) return;
        switch (paymentIntent.status) {
          case "succeeded":
            setIsSuccess(true);
            setSuccessMessage("Success! Your payment was successful.");

            break;

          case "processing":
            setIsSuccess(false);
            setSuccessMessage("Success! Your payment is processing.");

            break;

          case "requires_payment_method":
            setIsSuccess(false);
            setErrorMessage("Error! Your payment requires a payment method.");

            break;

          default:
            setIsSuccess(false);
            setErrorMessage("Error! Your payment failed.");
            break;
        }
      });
  };

  useEffect(() => {
    initStripe();
    const tId = tenantId;
    if (tId) setTenantId(tId);
  }, []);

  useEffect(() => {
    if (!clientSecret || Array.isArray(clientSecret) || !stripe) {
      return;
    }
    retrievePaymentIntent(stripe, clientSecret);
  }, [clientSecret, stripe]);

  return (
    <>
      <Navbar>
        <NavItems />
      </Navbar>
      <Flex
        flexDir={"column"}
        backgroundColor="whiteAlpha.300"
        p={10}
        border="1px solid #e6e6e6"
        borderRadius={20}
        boxShadow="md"
        m={10}
      >
        {isSuccess && successMessage && (
          <VStack spacing={10}>
            <Heading color={"green"} textAlign={"center"}>
              Payment Successful
            </Heading>
            <Text textAlign={"center"}>{successMessage}</Text>
            <Button onClick={() => router.push("/dashboard")}>
              Back to Dashboard
            </Button>
          </VStack>
        )}

        {!isSuccess && errorMessage && (
          <VStack spacing={10}>
            <Heading textAlign={"center"} color={"red"}>
              Payment Failed
            </Heading>
            <Text textAlign={"center"}>{errorMessage}</Text>
            <Button onClick={() => router.push("/dashboard")}>
              Back to Dashboard
            </Button>
          </VStack>
        )}

        {!isSuccess && successMessage && (
          <VStack spacing={10}>
            <Heading textAlign={"center"} color={"orange"}>
              Payment Processing
            </Heading>
            <Text textAlign={"center"}>{successMessage}</Text>
            <Button onClick={() => router.push("/dashboard")}>
              Back to Dashboard
            </Button>
          </VStack>
        )}
      </Flex>
    </>
  );
};

export default Success;
