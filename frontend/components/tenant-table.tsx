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
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DeleteIcon,
} from "@chakra-ui/icons";
import { RankingInfo } from "@tanstack/match-sorter-utils";
import {
  convertTenantsToRow,
  columns,
  fuzzyFilter,
} from "../util/tenant-table";
import { BotApiClient } from "./axios";
import { useAdminToken } from "../hooks/use-admin-token";
import { useQueryClient } from "@tanstack/react-query";

declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

interface TenantTableProps {
  tenants: Tenant[];
}

const TenantTable = ({ tenants }: TenantTableProps) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const rowsData = useMemo(() => convertTenantsToRow(tenants), [tenants]);
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
    const tenantId = tenants[index].id;
    BotApiClient.delete(`/tenant/${tenantId}`, {
      headers: {
        "x-auth-token": adminToken,
      },
    }).then(() => {
      queryClient.invalidateQueries([`tenants`]);
    });
  };

  const handleTenantEnable = (index: number, enabled: boolean) => {
    const tenantId = tenants[index].id;
    BotApiClient.put(
      `/tenant`,
      {
        id: tenantId,
        updateObject: {
          is_enabled: enabled,
        },
      },
      {
        headers: {
          "x-auth-token": adminToken,
        },
      }
    )
      .then(() => {
        queryClient.invalidateQueries([`tenants`]);
      })
      .catch(console.error);
  };

  return (
    <Flex flexDir={"column"} flex="1">
      <Heading fontSize={"3xl"} textAlign="center" my={5}>
        Tenants
      </Heading>
      <Input
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        placeholder="Search all columns"
        width={"60%"}
        my={3}
        mx={5}
      />
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
                  if (cell.column.id == "enabled") {
                    return (
                      <Td key={cell.id} textAlign="center">
                        <Switch
                          onChange={(e) =>
                            handleTenantEnable(row.index, e.target.checked)
                          }
                          isChecked={cell.getValue() ? true : false}
                        ></Switch>
                      </Td>
                    );
                  } else if (cell.column.id == "delete") {
                    return (
                      <Td key={cell.id} textAlign="center">
                        <IconButton
                          aria-label="delete tenant"
                          icon={<DeleteIcon />}
                          colorScheme="red"
                          variant="solid"
                          onClick={() => handleDelete(row.index)}
                        />
                      </Td>
                    );
                  } else if (cell.column.id == "details") {
                    return (
                      <Td key={cell.id} textAlign="center">
                        <Button
                          aria-label="details"
                          variant="solid"
                          onClick={() => {}}
                        >
                          Details
                        </Button>
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
    </Flex>
  );
};

export { TenantTable };
