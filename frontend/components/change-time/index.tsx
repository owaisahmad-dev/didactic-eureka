import { Flex, Heading, HStack, Select, Input, Button } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useChannel } from "../../hooks/use-channel";
import { useToken } from "../../hooks/use-token";
import { Tenant } from "../../types/tenant";
import { UpdateChannelTimeDto } from "../../types/update_channel_time";
import { BotApiClient } from "../axios";
import { possibleSchedules } from "../select-time";

export const ChangeTime = () => {
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const { channelId: chId } = useRouter().query;
  const [channelId, setChannelId] = useState(chId);

  const queryClient = useQueryClient();
  const { token } = useToken();

  const {
    data: channel,
    isLoading,
    isError,
    error, // TODO: use this to show errors
  } = useChannel(channelId as string);

  useEffect(() => {
    if (chId) {
      setChannelId(chId);
    }
  }, [chId]);

  useEffect(() => {
    if (!isLoading && !isError && channel) {
      setSelectedTime(() => {
        const date = new Date(channel.time);

        return date;
      });
      setSelectedSchedule(channel.schedule);
    }
  }, [channel, isLoading, isError]);

  const handleSaveClick = () => {
    const timezoneOffset = new Date().getTimezoneOffset();

    const hours = Math.floor(timezoneOffset / 60);
    const minutes = timezoneOffset % 60;

    let date;
    if (selectedTime) {
      date = new Date(selectedTime.toISOString());
    } else {
      return;
    }

    date.setHours(date.getHours() + hours);
    date.setMinutes(date.getMinutes() + minutes);

    const updateChannelTimeDto: UpdateChannelTimeDto = {
      id: channelId as string,
      time: date.toISOString(),
      schedule: selectedSchedule,
    };

    BotApiClient.put<Tenant>("/channel/time", updateChannelTimeDto, {
      headers: {
        "x-auth-token": token,
      },
    })
      .then((res) => res.data)
      .then((tenant) => {
        setUnsavedChanges(false);
        queryClient.invalidateQueries([`channel-${channelId}`]);
        queryClient.invalidateQueries([`tenant-${tenant.id}`]);
      });
  };

  return (
    <Flex
      flexDir={"column"}
      justifyContent="center"
      alignItems={"center"}
      mt={5}
    >
      <Heading>Set the schedule for your messages</Heading>
      <HStack my={5}>
        <Select
          placeholder={"Select Frequency"}
          value={selectedSchedule}
          onChange={(e) => {
            setSelectedSchedule(e.target.value);
            !unsavedChanges && setUnsavedChanges(true);
          }}
        >
          {possibleSchedules.map((schedule) => {
            return (
              <option key={schedule} value={schedule}>
                {schedule}
              </option>
            );
          })}
        </Select>
        <Input
          type={"time"}
          onChange={(e) => {
            !unsavedChanges && setUnsavedChanges(true);
            setSelectedTime(e.target.valueAsDate);
          }}
          value={
            !unsavedChanges
              ? selectedTime?.toTimeString().split(" ")[0]
              : undefined
          }
        ></Input>
      </HStack>
      <Button
        disabled={!selectedSchedule || !selectedTime || !unsavedChanges}
        onClick={handleSaveClick}
      >
        Update
      </Button>
    </Flex>
  );
};
