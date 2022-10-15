import { CheckCircleIcon } from "@chakra-ui/icons";
import { Flex, Button } from "@chakra-ui/react";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

export const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async () => {
    if (!stripe || !elements) {
      return;
    }

    await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "https://5867-2400-adc7-93b-7400-00-1.ngrok.io/success",
      },
    });
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
      <PaymentElement />
      <Button
        leftIcon={<CheckCircleIcon />}
        colorScheme="blue"
        mt={4}
        onClick={handleSubmit}
      >
        Pay
      </Button>
    </Flex>
  );
};
