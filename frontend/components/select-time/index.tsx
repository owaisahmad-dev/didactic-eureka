import {
  Button,
  Checkbox,
  Flex,
  Heading,
  HStack,
  Input,
  Select,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Category } from "../../types/category";
import { BotApiClient } from "../axios";
import timezones from "./timezones.json";

export const possibleSchedules = [
  "Everyday",
  "Weekdays",
  "Weekends",
  "Every Monday",
  "Every Tuesday",
  "Every Wednesday",
  "Every Thursday",
  "Every Friday",
  "Every Saturday",
  "Every Sunday",
];

interface SelectTimeProps {
  updateTime: (time: string, schedule: string) => void;
}

export const SelectTime = ({ updateTime }: SelectTimeProps) => {
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);

  return (
    <Flex
      flexDir={"column"}
      justifyContent="center"
      alignItems={"center"}
      mt={5}
    >
      <Heading>Set the schedule for which you want to receive messages</Heading>
      <HStack my={5}>
        <Select
          placeholder={"Select Frequency"}
          value={selectedSchedule}
          onChange={(e) => setSelectedSchedule(e.target.value)}
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
          onChange={(e) => setSelectedTime(e.target.valueAsDate)}
        ></Input>
      </HStack>
      <Button
        disabled={!selectedSchedule || !selectedTime}
        onClick={() =>
          selectedTime &&
          updateTime(selectedTime.toISOString(), selectedSchedule)
        }
      >
        Finish
      </Button>
    </Flex>
  );
};
