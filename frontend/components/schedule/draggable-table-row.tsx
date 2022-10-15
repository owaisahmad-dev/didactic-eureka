import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Td,
  Tr,
} from "@chakra-ui/react";
import { useSortable } from "@dnd-kit/sortable";
import { flexRender, Row } from "@tanstack/react-table";
import { CSS } from "@dnd-kit/utilities";
import { Data } from ".";
import { CameraIcon } from "./camera-icon";
import { DragHandle } from "./drag-handle";

export interface RowProps {
  row: Row<Data>;
  editQuestion: (index: number) => void;
  deleteQuestion: (index: number) => void;
}

const DraggableTableRow = ({ row, editQuestion, deleteQuestion }: RowProps) => {
  const {
    attributes,
    listeners,
    transform,
    transition,
    setNodeRef,
    isDragging,
  } = useSortable({
    id: row.index + 1,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition,
  };

  return (
    <Tr ref={setNodeRef} style={style}>
      {isDragging ? (
        <Td
          colSpan={row.getAllCells().length}
          backgroundColor="rgba(127, 207, 250, 0.3)"
        >
          &nbsp;
        </Td>
      ) : (
        row.getVisibleCells().map((cell, index) => {
          switch (cell.column.id) {
            case "date":
              return (
                <Td key={index}>
                  <DragHandle {...attributes} {...listeners} />
                  <span>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </span>
                </Td>
              );
            case "isPicture":
              return cell.getValue() ? (
                <Td key={index}>
                  <CameraIcon boxSize={6} color="red.200" />{" "}
                </Td>
              ) : (
                <Td key={index}></Td>
              );
            case "actions":
              return (
                <Td key={index}>
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      aria-label="options"
                      icon={<ChevronDownIcon />}
                      variant="solid"
                    />
                    <MenuList>
                      <MenuItem onClick={() => editQuestion(row.index)}>
                        Edit Message
                      </MenuItem>
                      <MenuItem onClick={() => deleteQuestion(row.index)}>
                        Delete Message
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Td>
              );
            default:
              return (
                <Td key={index}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Td>
              );
          }
        })
      )}
    </Tr>
  );
};

export { DraggableTableRow };
