import { Flex, Heading, Select, Button, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ChannelsListResponse } from "@slack/web-api";
import { Channel } from "@slack/web-api/dist/response/AdminUsergroupsListChannelsResponse";
import { UpdateChannelNameDto } from "../../types/update_channel_name";
import { useRouter } from "next/router";
import { Tenant } from "../../types/tenant";
import { useQueryClient } from "@tanstack/react-query";
import { BotApiClient, NextApiClient } from "../axios";
import { useTenant } from "../../hooks/use-tenant";
import { useChannel } from "../../hooks/use-channel";
import { useToken } from "../../hooks/use-token";

const ChangeChannel = () => {
  const [channel, setChannel] = useState<Channel | null>(null);
  const [availableChannels, setAvailableChannels] = useState<Channel[]>([]);
  const router = useRouter();
  const { channelId: chId } = router.query;
  const [channelId, setChannelId] = useState("");
  const queryClient = useQueryClient();
  const { tenantId, token } = useToken();
  const { data: tenant } = useTenant(tenantId);
  const { data: currentChannel } = useChannel(channelId);

  useEffect(() => {
    if (chId && !Array.isArray(chId)) {
      setChannelId(chId);
    }
  }, [chId]);

  const handleUpdateClick = () => {
    const updateChannelNameDto: UpdateChannelNameDto = {
      id: channelId as string,
      slack_id: channel?.id as string,
      name: channel?.name as string,
    };

    BotApiClient.put<Tenant>("/channel/name", updateChannelNameDto, {})
      .then((res) => res.data)
      .then((tenant) => {
        localStorage.setItem("tenantId", tenant.id);
        queryClient.invalidateQueries([`channel-${channelId}`]);
        queryClient.invalidateQueries([`tenant-${tenant.id}`]);
      });
  };

  const fetchChannels = () => {
    if (!tenant) {
      console.log("Unable to fetch Channels");
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

  const handleDelete = () => {
    BotApiClient.delete(`/channel?id=${channelId}`, {
      headers: {
        "x-auth-token": token,
      },
    }).then((res) => {
      const status = res.status;
      if (status === 200) {
        router.push("/dashboard");
      }
    });
  };

  useEffect(() => {
    if (tenant) fetchChannels();
  }, [tenant]);

  return (
    <Flex
      flexDir={"column"}
      justifyContent="center"
      alignItems={"center"}
      mt={5}
    >
      <Heading>Pick the channel you want to add Banter</Heading>
      <Text textAlign={"center"}>
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
        value={availableChannels
          .map((ac) => ac.name)
          .indexOf(currentChannel?.name)}
      >
        {availableChannels.map((channel, index) => {
          return (
            <option key={index} value={index}>{`#${channel.name}`}</option>
          );
        })}
      </Select>
      <Button disabled={!channel} onClick={handleUpdateClick}>
        Update
      </Button>
      <Button
        onClick={handleDelete}
        mt={5}
        size={"sm"}
        colorScheme={"red"}
        variant={"ghost"}
      >
        Delete Channel
      </Button>
    </Flex>
  );
};

export { ChangeChannel };
