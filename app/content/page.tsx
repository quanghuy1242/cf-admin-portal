"use client";

import { usePageMeta } from "../hooks/pageMeta";
import { fetcher } from "../utils/swc";
import "./page.css";
import { useMainStore } from "@/stores/providers/main-store";
import { ICategory, IContent } from "@/stores/slices/content";
import {
  ActionBar,
  ActionBarContainer,
  ActionButton,
  Cell,
  Column,
  ComboBox,
  Content,
  Flex,
  Heading,
  IllustratedMessage,
  Item,
  Link,
  Menu,
  MenuTrigger,
  Row,
  SearchField,
  StatusLight,
  TableBody,
  TableHeader,
  TableView,
  TabList,
  TabPanels,
  Tabs,
  Text,
  ToggleButton,
  useAsyncList,
} from "@adobe/react-spectrum";
import NoSearchResults from "@spectrum-icons/illustrations/NoSearchResults";
import Delete from "@spectrum-icons/workflow/Delete";
import Edit from "@spectrum-icons/workflow/Edit";
import MoreVertical from "@spectrum-icons/workflow/MoreVertical";
import PrintPreview from "@spectrum-icons/workflow/PrintPreview";
import { useCallback, useEffect, useRef, useState } from "react";
import useSWR from "swr";

interface IAB {
  keyy: any;
  item: IContent;
}

const CellByKey = ({ keyy, item }: IAB) => {
  const {
    rowIdForPreview,
    setRowIdForPreview,
    clearRowPreview,
    categoryStorage,
  } = useMainStore((s) => s);
  switch (keyy) {
    case "more":
      return (
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
      );

    case "status":
      const isDrafting = item.status === "PENDING";
      return (
        <StatusLight variant={isDrafting ? "yellow" : "positive"}>
          {isDrafting ? "Drafting" : "Published"}
        </StatusLight>
      );

    case "action":
      return (
        <ToggleButton
          UNSAFE_className="action-button"
          isQuiet
          isSelected={rowIdForPreview === item.id}
          onChange={(e) =>
            e ? setRowIdForPreview(item.id) : clearRowPreview()
          }
          UNSAFE_style={{
            display:
              rowIdForPreview !== item.id
                ? "var(--hover-button-display)"
                : "inline-block",
          }}
        >
          <PrintPreview />
        </ToggleButton>
      );

    case "title":
      return (
        <Link
          href={`/content/${item.id}`}
          isQuiet
          UNSAFE_style={{ color: "black" }}
        >
          {item.title}
        </Link>
      );

    case "categoryId":
      return <>{categoryStorage[item.categoryId]?.name || ""}</>;

    case "modified":
      return <>{new Date(item.modified).toLocaleString()}</>;

    default:
      return <>{item[keyy as keyof IContent]}</>;
  }
};

export default function ContentListPage() {
  const tableRef = useRef<any>();
  usePageMeta({ title: "Published content" });
  const {
    selectedRowIds,
    setSelectedRowIds,
    clearSelectedRowIds,
    contentStorage,
    appendContents,
    contentCursor,
    setContentCursor,
    setContentScrollPosition,
    contentScrollPosition,
    clearRowPreview,
    rowIdForPreview,
    appendCategorioes,
    categoryStorage,
  } = useMainStore((state) => state);

  const { data: categories } = useSWR(
    Object.keys(categoryStorage).length === 0 ? "/api/category" : null,
    fetcher,
  );

  useEffect(() => {
    if (categories) {
      appendCategorioes((categories as any).results as ICategory[]);
    }
  }, [categories]);

  // Columns for the table
  let columns = [
    { name: "Title", key: "title" },
    { name: "Action", key: "action" },
    { name: "Status", key: "status" },
    { name: "Category", key: "categoryId" },
    { name: "Latest date", key: "modified" },
    { name: "More", key: "more" },
  ];

  // The loader
  const _list = useAsyncList<IContent>({
    async load({ signal, cursor }) {
      if (cursor) {
        cursor = cursor.replace(/^http:\/\//i, "https://");
      }

      const res = await fetch(cursor || contentCursor, { signal });

      const json: any = await res.json();

      setContentCursor(json.next);
      appendContents(json.results);

      return {
        items: [],
        cursor: json.next,
      };
    },
  });

  // Cache this guy anyway
  const trackScrollPosition = useCallback(() => {
    const table = (
      tableRef.current as any
    ).UNSAFE_getDOMNode() as HTMLDivElement;
    const body = table.querySelector('[role="rowgroup"]');
    body?.scrollTo({ top: contentScrollPosition });
    function onscroll() {
      const curr = body?.scrollTop || 0;
      setContentScrollPosition(curr);
    }
    body?.addEventListener("scroll", onscroll);
    return () => {
      body?.removeEventListener("scroll", onscroll);
      clearRowPreview(); // Yah!
    };
  }, []);

  useEffect(trackScrollPosition, []);

  return (
    <Flex direction="row" height="calc(100vh - 90px)" gap="size-300">
      <Flex
        direction={"column"}
        gap={10}
        height="100%"
        marginX="auto"
        flexGrow={1}
        width="calc(100% - 400px)"
      >
        <Flex direction={"row"} gap={10} alignItems={"end"}>
          <Flex flexGrow={1} gap={10}>
            <SearchField label="Title keyword" />
            <ComboBox label="Favorite Animal">
              <Item key="red panda">Red Panda</Item>
              <Item key="cat">Cat</Item>
              <Item key="dog">Dog</Item>
              <Item key="aardvark">Aardvark</Item>
              <Item key="kangaroo">Kangaroo</Item>
              <Item key="snake">Snake</Item>
            </ComboBox>
          </Flex>
        </Flex>
        <ActionBarContainer height="calc(100vh - 150px)">
          <TableView
            UNSAFE_className="content-table"
            aria-label="example async loading table"
            selectionStyle="checkbox"
            selectionMode="multiple"
            selectedKeys={selectedRowIds}
            onSelectionChange={setSelectedRowIds}
            ref={tableRef}
          >
            <TableHeader columns={columns}>
              {(column) => (
                <Column
                  hideHeader={["more", "action"].includes(column.key)}
                  allowsResizing
                  align={column.key === "action" ? "end" : "start"}
                  width={
                    {
                      more: 100,
                      action: 50,
                      title: 300,
                    }[column.key] || null
                  }
                >
                  {column.name}
                </Column>
              )}
            </TableHeader>
            <TableBody
              items={contentStorage}
              loadingState={_list.loadingState}
              onLoadMore={_list.loadMore}
            >
              {(item) => (
                <Row key={item.id}>
                  {(key) => (
                    <Cell>
                      <CellByKey keyy={key} item={item} />
                    </Cell>
                  )}
                </Row>
              )}
            </TableBody>
          </TableView>
          <ActionBar
            isEmphasized
            selectedItemCount={
              selectedRowIds === "all" ? "all" : selectedRowIds.size
            }
            onClearSelection={clearSelectedRowIds}
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
      </Flex>
      <Flex minWidth={300} width={400} flexGrow={1}>
        <Tabs>
          <TabList>
            <Item>Content</Item>
            <Item>Information</Item>
          </TabList>
          <TabPanels>
            <Item>
              {rowIdForPreview ? (
                <div>You selected post {rowIdForPreview} for preview</div>
              ) : (
                <IllustratedMessage>
                  <NoSearchResults />
                  <Heading>It&apos;s empty here</Heading>
                  <Content>Select a row to preview.</Content>
                </IllustratedMessage>
              )}
            </Item>
            <Item>
              {rowIdForPreview ? (
                <div>
                  There&apos;s more to preview for this post! Comming very soon!
                </div>
              ) : (
                <IllustratedMessage>
                  <NoSearchResults />
                  <Heading>It&apos;s empty here</Heading>
                  <Content>Try to choose one?</Content>
                </IllustratedMessage>
              )}
            </Item>
          </TabPanels>
        </Tabs>
      </Flex>
    </Flex>
  );
}

export const runtime = "edge";
