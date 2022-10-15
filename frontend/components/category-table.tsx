import {
  FilterFn,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { Tenant } from "../types/tenant";
import {
  Text,
  Flex,
  HStack,
  IconButton,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Switch,
  Button,
  Heading,
} from "@chakra-ui/react";
import {
  AddIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DeleteIcon,
} from "@chakra-ui/icons";
import { RankingInfo } from "@tanstack/match-sorter-utils";
import { fuzzyFilter } from "../util/tenant-table";
import { BotApiClient } from "./axios";
import { useAdminToken } from "../hooks/use-admin-token";
import { useQueryClient } from "@tanstack/react-query";
import { Category } from "../types/category";
import { columns, convertCategoryToRow } from "../util/category-table";
import { AddCategoryModal } from "./add-category-modal";

declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

interface CategoryTableProps {
  categories: Category[];
}

const CategoryTable = ({ categories }: CategoryTableProps) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const rowsData = useMemo(
    () => convertCategoryToRow(categories),
    [categories]
  );

  const [addCategoryModalOpen, setAddCategoryModalOpen] = useState(false);
  const adminToken = useAdminToken();
  const queryClient = useQueryClient();
  const table = useReactTable({
    data: rowsData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      globalFilter,
    },
    globalFilterFn: fuzzyFilter,
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  });

  const handleDelete = (index: number) => {
    const categoryId = categories[index].id;
    BotApiClient.delete(`/category/${categoryId}`, {
      headers: {
        "x-auth-token": adminToken,
      },
    }).then(() => {
      queryClient.invalidateQueries([`categories`, `questions`]);
    });
  };

  return (
    <Flex flexDir={"column"} flex="1">
      <Heading fontSize={"3xl"} textAlign="center" my={5}>
        Categories
      </Heading>
      <Flex justifyContent={"space-between"}>
        <Input
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search all columns"
          width={"60%"}
          my={3}
          mx={5}
        />
        <Button
          onClick={() => setAddCategoryModalOpen(true)}
          leftIcon={<AddIcon />}
          colorScheme={"yellow"}
          mx={4}
        >
          Add Category
        </Button>
      </Flex>
      <Table>
        <Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <Th key={header.id} textAlign="center">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </Th>
                );
              })}
            </Tr>
          ))}
        </Thead>
        <Tbody>
          {table.getRowModel().rows.map((row) => {
            return (
              <Tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  if (cell.column.id == "actions") {
                    return (
                      <Td key={cell.id} textAlign="center">
                        <IconButton
                          aria-label="delete"
                          icon={<DeleteIcon />}
                          variant="solid"
                          colorScheme={"red"}
                          onClick={() => handleDelete(row.index)}
                        ></IconButton>
                      </Td>
                    );
                  } else {
                    return (
                      <Td key={cell.id} textAlign="center">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </Td>
                    );
                  }
                })}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
      <HStack mt={4} justifyContent="center">
        <IconButton
          aria-label="first page"
          icon={<ArrowLeftIcon />}
          onClick={() => table.setPageIndex(0)}
          disabled={table.getCanPreviousPage()}
        />
        <IconButton
          aria-label="previous page"
          icon={<ChevronLeftIcon />}
          onClick={() => table.previousPage()}
          disabled={table.getCanPreviousPage()}
        />

        <Flex alignItems="center">
          <Text flexShrink="0" mr={8}>
            Page{" "}
            <Text fontWeight="bold" as="span">
              {table.getState().pagination.pageIndex + 1}
            </Text>{" "}
            of{" "}
            <Text fontWeight="bold" as="span">
              {table.getPageCount()}
            </Text>
          </Text>
          <Text flexShrink="0">Go to page:</Text>{" "}
          <NumberInput
            ml={2}
            mr={8}
            w={28}
            min={1}
            max={table.getPageCount()}
            onChange={(value) => {
              const page = value ? Number(value) - 1 : 0;
              table.setPageIndex(page);
            }}
            defaultValue={table.getState().pagination.pageIndex + 1}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Select
            w={32}
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </Select>
        </Flex>

        <IconButton
          aria-label="last page"
          icon={<ArrowRightIcon />}
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={table.getCanNextPage()}
        />
        <IconButton
          aria-label="next page"
          icon={<ChevronRightIcon />}
          onClick={() => table.nextPage()}
          disabled={table.getCanNextPage()}
        />
      </HStack>
      <AddCategoryModal
        isOpen={addCategoryModalOpen}
        setOpen={setAddCategoryModalOpen}
      />
    </Flex>
  );
};

export { CategoryTable };
