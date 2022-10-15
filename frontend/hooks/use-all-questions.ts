import { useQuery } from "@tanstack/react-query";
import { BotApiClient } from "../components/axios";
import { Question } from "../types/question";

export const useAllQuestions = () => {
  const fetchAllQuestions = () => {
    return BotApiClient.get<Question[]>(`/question`).then((res) => res.data);
  };
  return useQuery([`questions`], () => fetchAllQuestions());
};
