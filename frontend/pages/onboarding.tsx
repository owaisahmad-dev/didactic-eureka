import { Heading } from "@chakra-ui/react";
import { NextPage } from "next";
import { useEffect } from "react";
import { NavItems } from "../components/nav-items";
import { Navbar } from "../components/navbar";
import { Wizard } from "../components/wizard";

const Onboarding: NextPage = () => {
  return (
    <>
      <Navbar>
        <NavItems />
      </Navbar>
      <Wizard />
    </>
  );
};
export default Onboarding;
