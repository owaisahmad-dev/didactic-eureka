import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useToken } from "../../hooks/use-token";
import { DeleteQuestionFromQueueDto } from "../../types/delete_question_from_queue";
import { BotApiClient } from "../axios";

interface DeleteQuestionModalProps {
  questionId: string | null;
  isOpen: boolean;
  closeModal: () => void;
}

export const DeleteQuestionModal = ({
  questionId,
  isOpen,
  closeModal,
}: DeleteQuestionModalProps) => {
  const [channelId, setChannelId] = useState("");
  const queryClient = useQueryClient();
  const { token } = useToken();

  const { channelId: chId } = useRouter().query;
  useEffect(() => {
    if (chId && !Array.isArray(chId)) {
      setChannelId(chId);
    }
  }, [chId]);

  const handleDelete = () => {
    if (!questionId) {
      closeModal();
      return;
    }

    const dto: DeleteQuestionFromQueueDto = {
      questionId,
      channelId,
    };

    BotApiClient.put("/channel/question", dto, {
      headers: {
        "x-auth-token": token,
      },
    })
      .then((res) => res.data)
      .then((tenant) => {
        queryClient.invalidateQueries([`channel-${channelId}`]);
        queryClient.invalidateQueries([`tenant-${tenant.id}`]);
      });

    closeModal();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => {}}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Question</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>Are you sure you want to delete this question?</p>
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleDelete} colorScheme="red" mr={3}>
              Delete
            </Button>
            <Button
              colorScheme="gray"
              onClick={() => {
                closeModal();
              }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
