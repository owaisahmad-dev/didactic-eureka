import { AddIcon } from "@chakra-ui/icons";
import { Button, Flex, GridItem, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";

export const AddChannelCard = () => {
  const router = useRouter();

  return (
    <GridItem>
      <Flex
        flex={1}
        borderColor="gray.300"
        backgroundColor={"gray.100"}
        borderWidth={1}
        borderRadius={15}
        m={10}
        flexDirection="column"
        alignItems={"center"}
        px={2}
        justifyContent="space-evenly"
        height="100%"
      >
        <Text>Add Work Besties to another channel</Text>
        <Text textAlign={"center"}>
          Work Besties bot will break the ice and spark conversation amongst
          your team
        </Text>
        <Button
          size={"sm"}
          leftIcon={<AddIcon />}
          colorScheme="orange"
          onClick={() => router.push("/onboarding")}
        >
          Add Channel
        </Button>
      </Flex>
    </GridItem>
  );
};
