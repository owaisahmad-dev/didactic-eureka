import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Textarea,
} from "@chakra-ui/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { QueuedQuestions } from "../../types/question";

interface EditQuestionModalProps {
  queuedQuestion: QueuedQuestions | null;
  questionIndex: number;
  setQuestions: Dispatch<SetStateAction<QueuedQuestions[]>>;
  isOpen: boolean;
  closeModal: () => void;
  updateChannelQuestions: () => void;
}

export const EditQuestionModal = ({
  queuedQuestion,
  questionIndex,
  setQuestions,
  isOpen,
  closeModal,
  updateChannelQuestions,
}: EditQuestionModalProps) => {
  const [questionText, setQuestionText] = useState(queuedQuestion?.text);

  const handleCancel = () => {
    closeModal();
  };

  useEffect(() => {
    if (queuedQuestion) {
      setQuestionText(queuedQuestion.text);
    }
  }, [queuedQuestion, questionIndex]);

  const handleSave = () => {
    setQuestions((questions) => {
      questions[questionIndex].text = questionText as string;
      questions[questionIndex].isEdited = true;
      return [...questions];
    });
    closeModal();
    updateChannelQuestions();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCancel}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Question</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Change Question Text</FormLabel>
            <Textarea
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              size="xl"
            ></Textarea>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="teal" mr={3} onClick={handleSave}>
            Save
          </Button>
          <Button colorScheme="gray" onClick={handleCancel}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
