import { Heading } from "@chakra-ui/react";
import { Elements } from "@stripe/react-stripe-js";
import { Stripe, StripeElementsOptions } from "@stripe/stripe-js";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { CheckoutForm } from "../components/checkout-form";
import { NavItems } from "../components/nav-items";
import { Navbar } from "../components/navbar";
import { getStripe } from "../util/get_stripe";

const PaymentPage: NextPage = () => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [options, setOptions] = useState<StripeElementsOptions | null>(null);

  const initStripe = async () => {
    const stripe = await getStripe();
    if (stripe) setStripe(stripe);
  };
  useEffect(() => {
    initStripe();
    const clientSecret = localStorage.getItem("clientSecret");
    if (clientSecret) setClientSecret(clientSecret);
  }, []);

  useEffect(() => {
    if (stripe && clientSecret) {
      setOptions({
        clientSecret,
      });
    }
  }, [stripe, clientSecret]);

  return (
    <>
      <Navbar>
        <NavItems />
      </Navbar>
      {stripe && options ? (
        <Elements stripe={stripe} options={options}>
          <CheckoutForm />
        </Elements>
      ) : (
        <Heading>Loading...</Heading>
      )}
    </>
  );
};

export default PaymentPage;
