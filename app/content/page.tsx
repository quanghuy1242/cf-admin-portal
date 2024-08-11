"use client";

import { useCategories } from "../hooks/use-category";
import { useContent } from "../hooks/use-content";
import { usePageMeta } from "../hooks/use-page-meta";
import { useTrackingScroll } from "../hooks/use-scroll-position";
import { IColumnContent, TableContent } from "./components/table";
import { PreviewButton, PreviewPannel } from "./components/table-row-preview";
import { TableContentToolbar } from "./components/table-toolbar";
import "./page.css";
import { useMainStore } from "@/stores/providers/main-store";
import { IContent } from "@/stores/slices/content";
import {
  ActionButton,
  Flex,
  Item,
  Link,
  Menu,
  MenuTrigger,
  StatusLight,
} from "@adobe/react-spectrum";
import MoreVertical from "@spectrum-icons/workflow/MoreVertical";
import { useEffect, useRef } from "react";

export default function ContentListPage() {
  const tableRef = useRef<HTMLDivElement>(null);
  const {
    selectedRowIds,
    setSelectedRowIds,
    clearSelectedRowIds,
    clearRowPreview,
    categoryStorage,
  } = useMainStore((state) => state);

  useCategories();
  usePageMeta({ title: "Published content" });
  useTrackingScroll(tableRef);
  const tableIndicator = useContent();

  useEffect(() => {
    return () => {
      clearRowPreview();
    };
  }, [clearRowPreview]);

  const columns: IColumnContent[] = [
    {
      key: "title",
      name: "Title",
      width: 300,
      render: (_, item: IContent) => (
        <Link
          href={`/content/${item.id}`}
          isQuiet
          UNSAFE_style={{ color: "black" }}
        >
          {item.title}
        </Link>
      ),
    },
    {
      key: "action",
      name: "Action",
      hideHeader: true,
      align: "end",
      width: 50,
      render: (_, item: IContent) => <PreviewButton item={item} />,
    },
    {
      key: "status",
      name: "Status",
      render: (_, item: IContent) => {
        const isDrafting = item.status === "PENDING";
        return (
          <StatusLight variant={isDrafting ? "yellow" : "positive"}>
            {isDrafting ? "Drafting" : "Published"}
          </StatusLight>
        );
      },
    },
    {
      key: "categoryId",
      name: "Category",
      render: (_, item: IContent) => (
        <>{categoryStorage[item.categoryId]?.name || ""}</>
      ),
    },
    {
      key: "modified",
      name: "Modified",
      width: 200,
      render: (_, item: IContent) => (
        <>{new Date(item.modified).toLocaleString()}</>
      ),
    },
    {
      key: "more",
      name: "More",
      hideHeader: true,
      render: (_, item: IContent) => (
        <MenuTrigger>
          <ActionButton isQuiet>
            <MoreVertical />
          </ActionButton>
          <Menu onAction={(key) => alert(key)}>
            <Item key="cut">Cut this shit</Item>
            <Item key="copy">Copy it out</Item>
            <Item key="paste">Paste this right here</Item>
            <Item key="replace">Replace him</Item>
          </Menu>
        </MenuTrigger>
      ),
    },
  ];

  return (
    <Flex direction="row" height="calc(100vh - 75px)" gap="size-300">
      <Flex
        direction={"column"}
        gap={10}
        height="100%"
        marginX="auto"
        flexGrow={1}
        width="calc(100% - 400px)"
      >
        <Flex direction={"row"} gap={10} alignItems={"end"}>
          <TableContentToolbar />
        </Flex>
        <div ref={tableRef}>
          <TableContent
            columns={columns}
            height="calc(100vh - 140px)"
            isRowLoading={tableIndicator.loadingState}
            onClearSelection={clearSelectedRowIds}
            onRowLoadMore={tableIndicator.loadMore}
            onSelectionChange={setSelectedRowIds}
            selectedRowIds={selectedRowIds}
          />
        </div>
      </Flex>
      <Flex minWidth={300} width={400} flexGrow={1}>
        <PreviewPannel />
      </Flex>
    </Flex>
  );
}

export const runtime = "edge";
