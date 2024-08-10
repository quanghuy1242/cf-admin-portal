"use client";

import "./page.css";
import type { Selection } from "@adobe/react-spectrum";
import {
  ActionBar,
  ActionBarContainer,
  ActionButton,
  Cell,
  Column,
  ComboBox,
  Flex,
  Item,
  Menu,
  MenuTrigger,
  Row,
  SearchField,
  TableBody,
  TableHeader,
  TableView,
  Text,
  Link,
  useAsyncList,
  StatusLight,
  View,
  Tabs,
  TabList,
  TabPanels,
  IllustratedMessage,
  Heading,
  Content,
} from "@adobe/react-spectrum";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import NoSearchResults from "@spectrum-icons/illustrations/NoSearchResults";
import Delete from "@spectrum-icons/workflow/Delete";
import Edit from "@spectrum-icons/workflow/Edit";
import MoreVertical from "@spectrum-icons/workflow/MoreVertical";
import PrintPreview from "@spectrum-icons/workflow/PrintPreview";
import { useState } from "react";

interface Character {
  name: string;
  height: number;
  birth_year: number;
}

const cellByKey = (key: any, item: Character) => {
  switch (key) {
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
      const isDrafting = item["height"] < 170;
      return (
        <StatusLight variant={isDrafting ? "yellow" : "positive"}>
          {isDrafting ? "Drafting" : "Published"}
        </StatusLight>
      );

    case "action":
      return (
        <ActionButton
          UNSAFE_className="action-button"
          isQuiet
          UNSAFE_style={{
            display: "var(--hover-button-display)",
          }}
        >
          <PrintPreview />
        </ActionButton>
      );

    case "name":
      return (
        <Link
          href={`/content/${item["height"]}`}
          isQuiet
          UNSAFE_style={{ color: "black" }}
        >
          {item[key as keyof Character]}
        </Link>
      );

    default:
      return <>{item[key as keyof Character]}</>;
  }
};

export default withPageAuthRequired(
  function ContentListPage() {
    let [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
    let columns = [
      { name: "Name", key: "name" },
      { name: "Action", key: "action" },
      { name: "Status", key: "status" },
      { name: "Height", key: "height" },
      { name: "Birth Year", key: "birth_year" },
      { name: "More", key: "more" },
    ];

    let list = useAsyncList<Character>({
      async load({ signal, cursor }) {
        if (cursor) {
          cursor = cursor.replace(/^http:\/\//i, "https://");
        }

        let res = await fetch(
          cursor || `https://swapi.py4e.com/api/people/?search=`,
          { signal },
        );
        let json: any = await res.json();

        return {
          items: json.results,
          cursor: json.next,
        };
      },
    });
    return (
      <Flex direction="row" height="calc(100vh - 90px)" gap="size-300">
        <Flex
          direction={"column"}
          gap={10}
          height="100%"
          // maxWidth={960}
          // maxWidth="90%"
          marginX="auto"
          // width="60%"
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
              selectedKeys={selectedKeys}
              onSelectionChange={setSelectedKeys}
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
                      }[column.key] || null
                    }
                  >
                    {column.name}
                  </Column>
                )}
              </TableHeader>
              <TableBody
                items={list.items}
                loadingState={list.loadingState}
                onLoadMore={list.loadMore}
              >
                {(item) => (
                  <Row key={item.name}>
                    {(key) => <Cell>{cellByKey(key, item)}</Cell>}
                  </Row>
                )}
              </TableBody>
            </TableView>
            <ActionBar
              isEmphasized
              selectedItemCount={
                selectedKeys === "all" ? "all" : selectedKeys.size
              }
              onClearSelection={() => {
                setSelectedKeys(new Set());
              }}
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
                <IllustratedMessage>
                  <NoSearchResults />
                  <Heading>It&apos;s empty here</Heading>
                  <Content>Select a row to preview.</Content>
                </IllustratedMessage>
              </Item>
              <Item>
                <IllustratedMessage>
                  <NoSearchResults />
                  <Heading>It&apos;s empty here</Heading>
                  <Content>Select a row to preview.</Content>
                </IllustratedMessage>
              </Item>
            </TabPanels>
          </Tabs>
        </Flex>
      </Flex>
    );
  },
  { returnTo: "/" },
);

export const runtime = "edge";
