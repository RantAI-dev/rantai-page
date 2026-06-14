"use client";

import * as React from "react";
import { flexRender, type Row, type Table as TanstackTable } from "@tanstack/react-table";
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { getColumnPinningStyle } from "@/lib/data-table";
import { cn } from "@/lib/utils";

interface DataTableProps<TData> extends React.ComponentProps<"div"> {
  table: TanstackTable<TData>;
  actionBar?: React.ReactNode;
  onRowClick?: (row: TData) => void;
  /**
   * Enables row drag-and-drop reordering. Called with the row ids in their new
   * order after a drop. Requires `getRowId` to be configured on the table.
   */
  onReorder?: (orderedIds: string[]) => void;
}

type SortableHandle = Pick<
  ReturnType<typeof useSortable>,
  "attributes" | "listeners"
>;

const RowDragContext = React.createContext<SortableHandle | null>(null);

/**
 * Drag handle used inside a column cell. Reads the active row's drag listeners
 * from context so a single `useSortable` call (on the row) powers both the row
 * transform and the handle.
 */
export function RowDragHandle() {
  const drag = React.useContext(RowDragContext);

  // No context means reordering is disabled for the current view (e.g. the
  // table is sorted by a column other than the order column).
  if (!drag) {
    return (
      <Button
        variant="ghost"
        size="icon"
        disabled
        tabIndex={-1}
        className="size-7 cursor-not-allowed text-muted-foreground/40 hover:bg-transparent"
      >
        <GripVertical className="size-4" />
        <span className="sr-only">Sort by Order to enable reordering</span>
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-7 cursor-grab text-muted-foreground hover:bg-transparent active:cursor-grabbing"
      onClick={(event) => event.stopPropagation()}
      {...drag.attributes}
      {...drag.listeners}
    >
      <GripVertical className="size-4" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
}

function handleRowClick<TData>(
  onRowClick: ((row: TData) => void) | undefined,
  original: TData,
) {
  return (event: React.MouseEvent<HTMLTableRowElement>) => {
    if (!onRowClick) return;
    const target = event.target as HTMLElement;
    if (
      target.closest(
        'button, a, input, [role="menuitem"], [role="checkbox"], [role="option"]',
      )
    )
      return;
    onRowClick(original);
  };
}

function renderCells<TData>(row: Row<TData>) {
  return row.getVisibleCells().map((cell) => (
    <TableCell
      key={cell.id}
      style={{
        ...getColumnPinningStyle({ column: cell.column, withBorder: true }),
      }}
    >
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </TableCell>
  ));
}

function SortableRow<TData>({
  row,
  onRowClick,
}: {
  row: Row<TData>;
  onRowClick?: (row: TData) => void;
}) {
  const { attributes, listeners, transform, transition, setNodeRef, isDragging } =
    useSortable({ id: row.id });

  return (
    <RowDragContext.Provider value={{ attributes, listeners }}>
      <TableRow
        ref={setNodeRef}
        data-state={row.getIsSelected() && "selected"}
        data-dragging={isDragging}
        className={cn(
          "relative hover:bg-muted/50 data-[dragging=true]:z-10 data-[dragging=true]:opacity-90 data-[dragging=true]:shadow-lg",
          onRowClick && "cursor-pointer",
        )}
        style={{ transform: CSS.Transform.toString(transform), transition }}
        onClick={handleRowClick(onRowClick, row.original)}
      >
        {renderCells(row)}
      </TableRow>
    </RowDragContext.Provider>
  );
}

export function DataTable<TData>({
  table,
  actionBar,
  onRowClick,
  onReorder,
  children,
  className,
  ...props
}: DataTableProps<TData>) {
  const rows = table.getRowModel().rows;
  const reorderEnabled = Boolean(onReorder);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
    useSensor(KeyboardSensor),
  );

  const rowIds = React.useMemo(() => rows.map((row) => row.id), [rows]);

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = rowIds.indexOf(String(active.id));
    const newIndex = rowIds.indexOf(String(over.id));
    if (oldIndex === -1 || newIndex === -1) return;
    onReorder?.(arrayMove(rowIds, oldIndex, newIndex));
  }

  const tableElement = (
    <div className="overflow-hidden rounded-md border">
      <Table className="table-fixed">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  colSpan={header.colSpan}
                  style={{
                    ...getColumnPinningStyle({
                      column: header.column,
                      withBorder: true,
                    }),
                  }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {rows?.length ? (
            rows.map((row) =>
              reorderEnabled ? (
                <SortableRow key={row.id} row={row} onRowClick={onRowClick} />
              ) : (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={cn(
                    "hover:bg-muted/50",
                    onRowClick && "cursor-pointer",
                  )}
                  onClick={handleRowClick(onRowClick, row.original)}
                >
                  {renderCells(row)}
                </TableRow>
              ),
            )
          ) : (
            <TableRow>
              <TableCell
                colSpan={table.getAllColumns().length}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div
      className={cn("flex w-full flex-col gap-2.5 overflow-auto", className)}
      {...props}
    >
      {children}
      {reorderEnabled ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={onDragEnd}
        >
          <SortableContext items={rowIds} strategy={verticalListSortingStrategy}>
            {tableElement}
          </SortableContext>
        </DndContext>
      ) : (
        tableElement
      )}
      <div className="flex flex-col gap-2.5">
        <DataTablePagination table={table} />
        {actionBar &&
          table.getFilteredSelectedRowModel().rows.length > 0 &&
          actionBar}
      </div>
    </div>
  );
}
