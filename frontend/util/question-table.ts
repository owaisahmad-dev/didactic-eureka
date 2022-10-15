import { createColumnHelper, FilterFn } from "@tanstack/react-table";
import { rankItem } from "@tanstack/match-sorter-utils";
import { Tenant } from "../types/tenant";
import { Question } from "../types/question";

export const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({ itemRank: itemRank });
  return itemRank.passed;
};

export interface QuestionData {
  text: string;
  categories: string;
  actions: boolean;
}

const columnHelper = createColumnHelper<QuestionData>();
export const columns = [
  columnHelper.accessor("text", {
    header: () => "Question Text",
  }),
  columnHelper.accessor("categories", {
    header: () => "Categories",
  }),
  columnHelper.accessor("actions", {
    header: () => "Actions",
  }),
];

export const convertQuestionToRow = (questions: Question[]): QuestionData[] => {
  if (!questions) {
    return [];
  }
  const data: QuestionData[] = questions.map((question) => {
    return {
      text: question.text,
      categories: question.__categories__.map((c) => c.name).join(", "),
      actions: true,
    };
  });

  return data;
};
