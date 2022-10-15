import { Td, Tr } from "@chakra-ui/react";
import { flexRender, RowSelection } from "@tanstack/react-table";
import { DragHandle } from "./drag-handle";
import { RowProps } from "./draggable-table-row";

export const StaticTableRow = ({ row }: RowProps) => {
  return (
    <Tr
      boxShadow={
        "rgb(0 0 0 / 10%) 0px 20px 25px -5px, rgb(0 0 0 / 30%) 0px 10px 10px -5px"
      }
      outline="#3e1eb3 solid 1px"
    >
      {row.getVisibleCells().map((cell, index) => {
        if (index === 0) {
          return (
            <Td key={index}>
              <DragHandle />
              <span>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </span>
            </Td>
          );
        }
        return (
          <Td key={index}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </Td>
        );
      })}
    </Tr>
  );
};
