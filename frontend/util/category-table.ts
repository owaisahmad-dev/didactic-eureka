import { createColumnHelper, FilterFn } from "@tanstack/react-table";
import { Category } from "../types/category";

export interface CategoryData {
  name: string;
  actions: boolean;
}

const columnHelper = createColumnHelper<CategoryData>();
export const columns = [
  columnHelper.accessor("name", {
    header: () => "Category Name",
  }),
  columnHelper.accessor("actions", {
    header: () => "Actions",
  }),
];

export const convertCategoryToRow = (
  categories: Category[]
): CategoryData[] => {
  if (!categories) {
    return [];
  }
  const data: CategoryData[] = categories.map((category) => {
    return {
      name: category.name,
      actions: true,
    };
  });

  return data;
};
