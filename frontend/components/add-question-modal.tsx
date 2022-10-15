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

interface AddQuestionModalProps {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
}

export const AddQuestionModal = ({
  isOpen,
  setOpen,
}: AddQuestionModalProps) => {
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
    fetchCategories();
  }, []);

  const handleCancel = () => {
    setQuestionText("");
    setSelectedCategories([]);
    setOpen(false);
  };

  const handleSave = async () => {
    const createQuestion = {
      text: questionText,
      categoryIds: selectedCategories,
    };
    await BotApiClient.post<Question>("/question/add", createQuestion, {
      headers: {
        "x-auth-token": adminToken,
      },
    }).then(() => queryClient.invalidateQueries([`questions`]));

    setQuestionText("");
    setSelectedCategories([]);
    setOpen(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCancel}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Question</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Question Text</FormLabel>
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
