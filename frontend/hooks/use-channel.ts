import { useQuery } from "@tanstack/react-query";
import { BotApiClient } from "../components/axios";
import { Channel } from "../types/channel";
import { useToken } from "./use-token";

export const useChannel = (channelId: string) => {
  const { token } = useToken();

  const fetchChannel = (channelId: string) => {
    return BotApiClient.get<Channel>(`/channel?id=${channelId}`, {
      headers: {
        "x-auth-token": token,
      },
    }).then((res) => res.data);
  };
  return useQuery([`channel-${channelId}`], () => fetchChannel(channelId), {
    enabled: !!channelId && !!token,
  });
};
