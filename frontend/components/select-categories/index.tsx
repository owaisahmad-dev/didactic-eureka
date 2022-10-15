import {
  Button,
  Checkbox,
  Flex,
  Heading,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Category } from "../../types/category";
import { BotApiClient } from "../axios";

interface SelectCategoriesProps {
  updateCategories: (categories: string[]) => void;
}

export const SelectCategories = ({
  updateCategories,
}: SelectCategoriesProps) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<Category[]>(
    []
  );

  const fetchCategories = () => {
    BotApiClient.get<Category[]>("category/all").then((res) => {
      setAvailableCategories(res.data);
      setSelectedCategories(res.data.map((c) => c.id));
    });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <Flex
      flexDir={"column"}
      justifyContent="center"
      alignItems={"center"}
      mt={5}
    >
      <Heading>
        Select the categories from which you want to receive questions
      </Heading>
      <Text>
        We recommend using all categories to ensure that you receive all types
        of questions.
      </Text>
      <VStack my={5} alignItems={"flex-start"} justifyContent={"flex-start"}>
        {availableCategories.map((category) => {
          return (
            <Checkbox
              key={category.id}
              isChecked={selectedCategories.includes(category.id)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedCategories([...selectedCategories, category.id]);
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
      <Button
        disabled={selectedCategories.length === 0}
        onClick={() => {
          updateCategories(selectedCategories);
        }}
      >
        Next...
      </Button>
    </Flex>
  );
};
