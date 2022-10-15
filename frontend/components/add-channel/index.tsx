import { Button, Flex, Heading, Select, Text } from "@chakra-ui/react";
import { ChannelsListResponse } from "@slack/web-api";
import { Channel } from "@slack/web-api/dist/response/AdminUsergroupsListChannelsResponse";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTenant } from "../../hooks/use-tenant";
import { useToken } from "../../hooks/use-token";
import { NextApiClient } from "../axios";

interface AddChannelProps {
  updateChannel: (channel: Channel) => void;
}

export const AddChannel = ({ updateChannel }: AddChannelProps) => {
  const [channel, setChannel] = useState<Channel | null>(null);
  const [availableChannels, setAvailableChannels] = useState<Channel[]>([]);
  const { token, tenantId } = useToken();
  const { data: tenant } = useTenant(tenantId ? tenantId : "");
  const router = useRouter();

  const fetchChannels = () => {
    if (!tenant) {
      return;
    }

    return NextApiClient.post<ChannelsListResponse>(
      "channel_list",
      {
        accessToken: tenant.access_token,
      },
      {
        headers: {
          "x-auth-token": token,
        },
      }
    ).then((res) => {
      if (res.status >= 200 && res.status < 300) {
        const channels = res.data.channels;
        if (channels) {
          setAvailableChannels(() => {
            const joinedChannels = tenant.__channels__.map((c) => c.id);
            return channels.filter(
              (c) => !joinedChannels.includes(c.id as string)
            );
          });
        }
      }
    });
  };

  useEffect(() => {
    if (tenant) {
      fetchChannels();
    }
  }, [tenant]);

  return (
    <Flex
      flexDir={"column"}
      justifyContent="center"
      alignItems={"center"}
      mt={5}
    >
      <Heading>Pick the channel you want to add Banter</Heading>
      <Text>
        We recommend adding Banter to a channel that is already used for small
        talk and getting to know each other. #random or #general are usually
        good fits.
      </Text>
      <Select
        placeholder={"Select a channel to get started..."}
        onChange={(e) =>
          setChannel(availableChannels[parseInt(e.target.value)])
        }
        width="50%"
        my={5}
      >
        {availableChannels.map((channel, index) => {
          return (
            <option key={index} value={index}>{`#${channel.name}`}</option>
          );
        })}
      </Select>
      <Button
        disabled={!channel}
        onClick={() => (channel ? updateChannel(channel) : null)}
      >
        Add Channel
      </Button>
    </Flex>
  );
};
