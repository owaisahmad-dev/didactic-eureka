import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  ModalFooter,
  Button,
  Input,
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useAdminToken } from "../hooks/use-admin-token";
import { Question } from "../types/question";
import { BotApiClient } from "./axios";

interface AddCategoryModalProps {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
}

export const AddCategoryModal = ({
  isOpen,
  setOpen,
}: AddCategoryModalProps) => {
  const [categoryName, setCategoryName] = useState("");
  const adminToken = useAdminToken();
  const queryClient = useQueryClient();

  const handleCancel = () => {
    setCategoryName("");
    setOpen(false);
  };

  const handleSave = async () => {
    const createCategory = {
      name: categoryName,
    };
    await BotApiClient.post<Question>("/category/add", createCategory, {
      headers: {
        "x-auth-token": adminToken,
      },
    }).then(() => queryClient.invalidateQueries([`categories`]));

    setCategoryName("");
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
            <FormLabel>Category Name</FormLabel>
            <Input
              p={1}
              pl={2}
              borderRadius="lg"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              size="xl"
              placeholder="Enter category name"
            ></Input>
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
