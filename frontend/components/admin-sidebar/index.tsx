import { AddIcon } from "@chakra-ui/icons";
import { Heading, Button, Box } from "@chakra-ui/react";
import { useState } from "react";
import { AdminSidebarItem } from "./admin-sidebar-items";

interface AdminSidebarProps {
  sidebarItems: string[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}

export const AdminSidebar = ({
  sidebarItems,
  activeIndex,
  setActiveIndex,
}: AdminSidebarProps) => {
  return (
    <Box height={"100%"} backgroundColor={"#000"} py={10}>
      {sidebarItems.map((item, i) => (
        <AdminSidebarItem
          key={i}
          item={item}
          active={activeIndex == i}
          index={i}
          setActiveIndex={setActiveIndex}
        />
      ))}
    </Box>
  );
};
