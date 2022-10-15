import React from "react";
import { Flex, HStack, Text } from "@chakra-ui/react";
import Image from "next/image";
interface LayoutProps {
  children?: React.ReactNode;
}

export const Navbar = ({ children }: LayoutProps) => {
  return (
    <Flex
      align="center"
      justifyContent={"space-between"}
      width="100%"
      p={2}
      // background color should be fresh teal
      backgroundColor="black"
      // text color should be in contrast with the background color
    >
      <HStack>
        <Image src={"/logo.png"} height={100} width={100} />
        <Text color={"#fdca40"} fontSize="3xl">
          Work
        </Text>
        <Text color={"#feeab3"} fontSize="3xl">
          Besties
        </Text>
      </HStack>
      <>{children}</>
    </Flex>
  );
};
