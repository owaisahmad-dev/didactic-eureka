import { Flex } from "@chakra-ui/react";

interface AdminSidebarProps {
  item: string;
  active: boolean;
  setActiveIndex: (active: number) => void;
  index: number;
}

export const AdminSidebarItem = ({
  item,
  active,
  setActiveIndex,
  index,
}: AdminSidebarProps) => {
  return (
    <Flex
      backgroundColor={"black"}
      p="4"
      mx="4"
      cursor={"pointer"}
      color="white"
      _hover={{
        backgroundColor: "gray.100",
        color: "black",
      }}
      style={{
        ...(active && {
          borderBottom: "2px solid #fdca40",
        }),
      }}
      px={70}
      onClick={() => setActiveIndex(index)}
    >
      {item}
    </Flex>
  );
};
