import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@chakra-ui/react";
import { ChangeCategories } from "../change-categories";
import { ChangeChannel } from "../change-channel";
import { ChangeTime } from "../change-time";
import { SettingsOverview } from "../settings-overview";

const SettingsTabs = () => {
  return (
    <Tabs variant="line" colorScheme={"teal"}>
      <TabList>
        <Tab>Overview</Tab>
        <Tab>Change Channel</Tab>
        <Tab>Change Topics</Tab>
        <Tab>Change Schedule</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <SettingsOverview />
        </TabPanel>
        <TabPanel>
          <ChangeChannel />
        </TabPanel>
        <TabPanel>
          <ChangeCategories />
        </TabPanel>
        <TabPanel>
          <ChangeTime />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export { SettingsTabs };
