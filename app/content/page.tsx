"use client";

import { useCategories } from "../hooks/use-category";
import { useInfContents } from "../hooks/use-content";
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
  Image,
  Item,
  Link,
  Menu,
  MenuTrigger,
  StatusLight,
  Tooltip,
  TooltipTrigger,
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
    rowIdForPreview,
  } = useMainStore((state) => state);

  usePageMeta({ title: "Published content" });
  useTrackingScroll(tableRef);

  const contents = useInfContents();
  const { data: categories, isLoading: isCateLoading } = useCategories();

  useEffect(() => {
    return () => {
      clearRowPreview();
    };
  }, [clearRowPreview]);

  if (contents.isLoading || isCateLoading || !categories || !contents.data)
    return <>Loading...</>;

  const columns: IColumnContent[] = [
    {
      key: "image",
      name: "Thumbnail",
      hideHeader: true,
      render: (_, item: IContent) => (
        <Image src={item.coverImage} alt={item.title} />
      ),
    },
    {
      key: "title",
      name: "Title",
      width: 300,
      render: (
        _,
        item: IContent, // Add prefetch
      ) => (
        <TooltipTrigger delay={1000} crossOffset={50} placement="bottom start">
          <Link
            href={`/content/${item.id}`}
            isQuiet
            UNSAFE_style={{ color: "black" }}
          >
            {item.title}
          </Link>
          <Tooltip>{item.title}</Tooltip>
        </TooltipTrigger>
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
      minWidth: 150,
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
      minWidth: 150,
      render: (_, item: IContent) => {
        if (isCateLoading) return <>Loading</>;
        return (
          <>{categories.filter((c) => c.id === item.categoryId)[0].name}</>
        );
      },
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
            items={contents.data.flatMap((c) => c)}
            columns={columns}
            height="calc(100vh - 140px)"
            isRowLoading={contents.isLoading ? "loadingMore" : "idle"}
            onClearSelection={clearSelectedRowIds}
            onRowLoadMore={contents.loadMore}
            onSelectionChange={setSelectedRowIds}
            selectedRowIds={selectedRowIds}
          />
        </div>
      </Flex>
      <Flex minWidth={300} width={400} flexGrow={1}>
        <PreviewPannel
          content={
            rowIdForPreview
              ? contents.data
                  .flatMap((c) => c)
                  .filter((c) => c.id === rowIdForPreview)[0]
              : null
          }
        />
      </Flex>
    </Flex>
  );
}

export const runtime = "edge";
