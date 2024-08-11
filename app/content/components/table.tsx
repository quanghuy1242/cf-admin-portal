"use client";

import { useMainStore } from "@/stores/providers/main-store";
import { IContent } from "@/stores/slices/content";
import {
  ActionBar,
  ActionBarContainer,
  Cell,
  Column,
  Item,
  Key,
  Row,
  Selection,
  TableBody,
  TableHeader,
  TableView,
  Text,
} from "@adobe/react-spectrum";
import Delete from "@spectrum-icons/workflow/Delete";
import Edit from "@spectrum-icons/workflow/Edit";
import { forwardRef, ReactNode, Ref } from "react";

export interface IColumnContent {
  name: string;
  key: string;
  width?: number;
  hideHeader?: boolean;
  align?: "start" | "center" | "end";
  render?: (key: Key, item: IContent) => ReactNode;
}

export interface DOMRefValue<T extends HTMLElement = HTMLElement> {
  UNSAFE_getDOMNode(): T;
}

export type DOMRef<T extends HTMLElement = HTMLElement> = Ref<DOMRefValue<T>>;

export interface ITableContentProps {
  selectedRowIds: "all" | Set<Key>;
  onSelectionChange: (keys: Selection) => void;
  rref?: any;
  columns: IColumnContent[];
  onClearSelection: () => void;
  onRowLoadMore: () => any;
  isRowLoading:
    | "loading"
    | "sorting"
    | "loadingMore"
    | "error"
    | "idle"
    | "filtering";
  height: string;
}

export const TableContent = ({
  selectedRowIds,
  onSelectionChange,
  rref,
  columns,
  onClearSelection,
  onRowLoadMore,
  isRowLoading,
  height,
}: ITableContentProps) => {
  const { contentStorage } = useMainStore((s) => s);
  const defaultCellRender: IColumnContent["render"] = (
    key: Key,
    item: IContent,
  ) => <>{item[key as keyof IContent]}</>;
  const renderCell = Object.fromEntries(
    columns.map((c) => [c.key, c.render || defaultCellRender]),
  );
  return (
    <ActionBarContainer height={height}>
      <TableView
        UNSAFE_className="content-table"
        aria-label="example async loading table"
        selectionStyle="checkbox"
        selectionMode="multiple"
        selectedKeys={selectedRowIds}
        onSelectionChange={onSelectionChange}
        ref={rref}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <Column
              hideHeader={column.hideHeader || false}
              allowsResizing
              align={column.align || "start"}
              width={column.width || null}
            >
              {column.name}
            </Column>
          )}
        </TableHeader>
        <TableBody
          items={Object.values(contentStorage)}
          loadingState={isRowLoading}
          onLoadMore={onRowLoadMore}
        >
          {(item) => (
            <Row key={item.id}>
              {(key) => <Cell>{renderCell[key](key, item)}</Cell>}
            </Row>
          )}
        </TableBody>
      </TableView>
      <ActionBar
        isEmphasized
        selectedItemCount={
          selectedRowIds === "all" ? "all" : selectedRowIds.size
        }
        onClearSelection={onClearSelection}
        onAction={(key) => alert(`Performing ${key} action...`)}
      >
        <Item key="edit">
          <Edit />
          <Text>Edit</Text>
        </Item>
        <Item key="delete">
          <Delete />
          <Text>Delete</Text>
        </Item>
      </ActionBar>
    </ActionBarContainer>
  );
};
