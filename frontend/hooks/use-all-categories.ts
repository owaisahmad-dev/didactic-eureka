import { useQuery } from "@tanstack/react-query";
import { BotApiClient } from "../components/axios";
import { Category } from "../types/category";

export const useAllCategories = () => {
  const fetchAllCategories = () => {
    return BotApiClient.get<Category[]>(`/category/all`).then(
      (res) => res.data
    );
  };
  return useQuery([`categories`], () => fetchAllCategories());
};
