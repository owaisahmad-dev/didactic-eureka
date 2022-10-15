import { Box, Button, Flex, Heading, HStack, Text } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useChannel } from "../../hooks/use-channel";
import { useTenant } from "../../hooks/use-tenant";
import { useToken } from "../../hooks/use-token";
import { QueuedQuestions } from "../../types/question";
import { Tenant } from "../../types/tenant";
import { UpdateChannelQuestionsQueueDto } from "../../types/update_channel_questions_queue";
import { BotApiClient } from "../axios";
import { Schedule } from "../schedule";
import { EditQuestionModal } from "./edit-question-modal";

export const SettingsOverview = () => {
  const { channelId: chId } = useRouter().query;
  const [channelId, setChannelId] = useState(chId);
  const [questions, setQuestions] = useState<QueuedQuestions[]>([]);
  const [editQuestion, setEditQuestion] = useState<QueuedQuestions | null>(
    null
  );
  const [editQuestionIndex, setEditQuestionIndex] = useState<number>(-1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: channel,
    isLoading,
    isError,
    error, // TODO: use this to show errors
  } = useChannel(channelId as string);
  const { tenantId, token } = useToken();

  useEffect(() => {
    if (!isLoading && !isError && channel) {
      setQuestions(channel.questionsQueue);
    }
  }, [channel, isLoading, isError]);

  useEffect(() => {
    if (editQuestion && editQuestionIndex > -1) {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  }, [editQuestion, editQuestionIndex]);

  useEffect(() => {
    if (chId) {
      setChannelId(chId);
    }
  }, [chId]);

  const closeModal = () => {
    setEditQuestion(null);
    setEditQuestionIndex(-1);
  };

  const editQuestionAtIndex = (question: QueuedQuestions, index: number) => {
    console.log(index);
    setEditQuestion(question);
    setEditQuestionIndex(index);
  };

  const updateChannelQuestions = () => {
    const updateChannelQuestions: UpdateChannelQuestionsQueueDto = {
      id: channelId as string,
      questionsQueue: questions,
    };

    BotApiClient.put<Tenant>("/channel/questions", updateChannelQuestions, {
      headers: {
        "x-auth-token": token,
      },
    })
      .then((res) => res.data)
      .then((tenant) => {
        setUnsavedChanges(false);
        queryClient.invalidateQueries([`channel-${channelId}`]);
        queryClient.invalidateQueries([`tenant-${tenantId}`]);
      });
  };

  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const queryClient = useQueryClient();

  const handleSaveClick = () => {
    updateChannelQuestions();
  };

  return (
    <Box>
      <Flex alignItems={"center"}>
        <HStack backgroundColor="gray.100" p={5} ml={3} my={10} flex="1">
          <Text fontSize={"xl"}>Ice breaking is happening </Text>
          <Text
            fontSize={"3xl"}
            fontWeight={"black"}
            textDecoration="underline"
          >
            {`${channel?.schedule.toLowerCase()} ${
              channel
                ? new Date(channel.time).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""
            }`}
          </Text>
          <Text fontSize={" 3xl"}>in </Text>
          <Text
            fontSize={"3xl"}
            fontWeight={"black"}
            textDecoration="underline"
          >
            {`#${channel?.name}`}
          </Text>
        </HStack>
        <Button
          onClick={handleSaveClick}
          disabled={!unsavedChanges}
          colorScheme={"teal"}
          m={10}
        >
          Save Changes
        </Button>
      </Flex>
      <Heading>
        The next {`${channel?.questionsQueue.length}`} upcoming messages!
      </Heading>
      {unsavedChanges && (
        <Text ml={3} fontSize="sm" color={"GrayText"}>
          *unsaved changes made to the queue
        </Text>
      )}
      {!isLoading && !isError && questions.length > 0 && (
        <Schedule
          setUnsavedChanges={setUnsavedChanges}
          questions={questions}
          setQuestions={setQuestions}
          editQuestionAtIndex={editQuestionAtIndex}
        />
      )}
      <EditQuestionModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        queuedQuestion={editQuestion}
        setQuestions={setQuestions}
        questionIndex={editQuestionIndex}
        updateChannelQuestions={updateChannelQuestions}
      />
    </Box>
  );
};
