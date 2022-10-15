import { Box, Heading } from "@chakra-ui/react";
import { NextPage } from "next";
import { NavItems } from "../../components/nav-items";
import { Navbar } from "../../components/navbar";
import { SettingsTabs } from "../../components/settings-tabs";
import { Sidebar } from "../../components/sidebar";

const Settings: NextPage = () => {
  return (
    <>
      <Navbar>
        <NavItems />
      </Navbar>
      <Box display={"flex"}>
        <Sidebar />
        <Box flex="1">
          <SettingsTabs />
        </Box>
      </Box>
    </>
  );
};

export default Settings;
