import { Table, Tbody, Th, Thead, Tr } from "@chakra-ui/react";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  useSensor,
  useSensors,
  TouchSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { QueuedQuestions } from "../../types/question";
import { DeleteQuestionModal } from "./delete-question-modal";
import { DraggableTableRow } from "./draggable-table-row";
import { StaticTableRow } from "./static-table-row";

export interface Data {
  date: string;
  prompt: string;
  isPicture: boolean;
  topics: string;
  actions: boolean;
}

const columnHelper = createColumnHelper<Data>();

const columns = [
  columnHelper.accessor("date", {
    header: () => "Date",
  }),
  columnHelper.accessor("prompt", {
    header: () => "Prompt",
  }),
  columnHelper.accessor("isPicture", {
    header: () => "",
  }),
  columnHelper.accessor("topics", {
    header: () => "Topics",
  }),
  columnHelper.accessor("actions", {
    header: () => "",
  }),
];

const convertQuestionsToRow = (questions: QueuedQuestions[]): Data[] => {
  if (!questions) {
    return [];
  }

  console.log({ questions });

  const data: Data[] = questions.map((q) => ({
    date: new Date(q.date).toDateString().split(" ").slice(0, -1).join(" "),
    prompt: q.text,
    isPicture: q.image_url ? true : false,
    topics: q.__categories__.map((c) => c.name).join(", "),
    actions: true,
  }));

  return data;
};

interface ScheduleProps {
  questions: QueuedQuestions[];
  setUnsavedChanges: Dispatch<SetStateAction<boolean>>;
  setQuestions: Dispatch<SetStateAction<QueuedQuestions[]>>;
  editQuestionAtIndex: (question: QueuedQuestions, index: number) => void;
}

export const Schedule = ({
  questions,
  setQuestions,
  setUnsavedChanges,
  editQuestionAtIndex,
}: ScheduleProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteQuestionId, setDeleteQuestionId] = useState<string | null>(null);

  const [activeId, setActiveId] = useState<number | null>(null);

  const rowsData = useMemo<Data[]>(() => {
    return convertQuestionsToRow(questions);
  }, [questions]);

  const [data, setData] = useState(rowsData);
  const items = useMemo(() => data.map((_, index) => index + 1), [data]);

  useEffect(() => {
    setData(rowsData);
  }, [rowsData]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  const handleDragStart = (e: DragStartEvent) => {
    setActiveId(e.active.id as number);
  };

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (active.id !== over?.id) {
      const oldIndex = items.indexOf(active.id as number);
      const newIndex = items.indexOf(over?.id as number);

      const { date: q1Date, ...q1Data } = questions[oldIndex];
      const { date: q2Date, ...q2Data } = questions[newIndex];

      questions[newIndex] = {
        date: q2Date,
        ...q1Data,
      };

      questions[oldIndex] = {
        date: q1Date,
        ...q2Data,
      };

      setQuestions([...questions]);
      setUnsavedChanges(true);
    }

    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const selectedRow = useMemo(() => {
    if (activeId == null) {
      return null;
    }
    const rows = table.getRowModel().rows;
    const row = rows.find((_, index) => index + 1 === activeId) || null;
    return row;
  }, [activeId, table]);

  const editQuestion = (index: number) => {
    editQuestionAtIndex(questions[index], index);
  };
  const deleteQuestion = (index: number) => {
    setDeleteQuestionId(questions[index].id);
  };

  const modalClose = () => {
    setDeleteQuestionId(null);
  };

  useEffect(() => {
    if (deleteQuestionId) {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  }, [deleteQuestionId]);

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      onDragCancel={handleDragCancel}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
    >
      <DeleteQuestionModal
        isOpen={isModalOpen}
        closeModal={modalClose}
        questionId={deleteQuestionId}
      />
      <Table>
        <Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Th key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody>
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            {table.getRowModel().rows.map((row, index) => (
              <DraggableTableRow
                key={index}
                row={row}
                editQuestion={editQuestion}
                deleteQuestion={deleteQuestion}
              />
            ))}
          </SortableContext>
        </Tbody>
      </Table>
      <DragOverlay>
        {activeId && selectedRow && (
          <Table>
            <Tbody>
              <StaticTableRow
                row={selectedRow}
                editQuestion={editQuestion}
                deleteQuestion={deleteQuestion}
              />
            </Tbody>
          </Table>
        )}
      </DragOverlay>
    </DndContext>
  );
};
