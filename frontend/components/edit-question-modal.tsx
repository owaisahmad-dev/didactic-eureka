import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Textarea,
  ModalFooter,
  Button,
  Checkbox,
  VStack,
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useAdminToken } from "../hooks/use-admin-token";
import { Category } from "../types/category";
import { Question } from "../types/question";
import { BotApiClient } from "./axios";

interface EditQuestionModalProps {
  isOpen: boolean;
  closeModal: () => void;
  question: Question | null;
}

export const EditQuestionModal = ({
  isOpen,
  closeModal,
  question,
}: EditQuestionModalProps) => {
  const [questionText, setQuestionText] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<Category[]>(
    []
  );
  const adminToken = useAdminToken();
  const queryClient = useQueryClient();

  const fetchCategories = () => {
    BotApiClient.get<Category[]>("category/all", {
      headers: {
        "x-auth-token": adminToken,
      },
    }).then((res) => {
      setAvailableCategories(res.data);
    });
  };

  useEffect(() => {
    if (question) {
      setQuestionText(question.text);
      setSelectedCategories(question.__categories__.map((c) => c.id));
    }
  }, [question]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCancel = () => {
    closeModal();
  };

  const handleSave = async () => {
    const updateQuestion = {
      id: question?.id,
      text: questionText,
      categoryIds: selectedCategories,
    };
    await BotApiClient.put<Question>("/question", updateQuestion, {
      headers: {
        "x-auth-token": adminToken,
      },
    }).then(() => queryClient.invalidateQueries([`questions`]));

    closeModal();
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
          <VStack
            my={5}
            alignItems={"flex-start"}
            justifyContent={"flex-start"}
          >
            {availableCategories.map((category) => {
              return (
                <Checkbox
                  key={category.id}
                  isChecked={selectedCategories.includes(category.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedCategories([
                        ...selectedCategories,
                        category.id,
                      ]);
                    } else {
                      setSelectedCategories(
                        selectedCategories.filter((c) => c !== category.id)
                      );
                    }
                  }}
                >
                  {category.name}
                </Checkbox>
              );
            })}
          </VStack>
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
