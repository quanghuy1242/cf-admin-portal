"use client";

import { useCategories } from "@/app/hooks/use-category";
import { usePageMeta } from "@/app/hooks/use-page-meta";
import { Editor } from "@/editor/editor";
import { useMainStore } from "@/stores/providers/main-store";
import {
  Button,
  Flex,
  Image,
  Item,
  Picker,
  TabList,
  TabPanels,
  Tabs,
  TagGroup,
  TextField,
  View,
} from "@adobe/react-spectrum";
import { LexicalEditor } from "lexical";
import { useEffect, useRef, useState } from "react";

export default function ContentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const {
    setActiveContentId,
    contentStorage,
    appendContents,
    categoryStorage,
  } = useMainStore((s) => s);

  const [isEditorReady, setEditorReady] = useState(false);
  const editor = useRef<LexicalEditor>(null);
  usePageMeta({ title: `Editing post with ID ${params.id}` });
  useCategories();
  setActiveContentId(params.id);

  // On direct payload, need to fetch data instead
  useEffect(() => {
    async function fetchData() {
      const content = await fetch("/api/content/" + params.id);
      appendContents([await content.json()]);
      setEditorReady(true);
    }
    if (!contentStorage[params.id]) {
      fetchData();
    } else {
      setEditorReady(true);
    }
  }, [appendContents, contentStorage, params.id]);

  return (
    <Flex>
      <Editor
        ready={isEditorReady}
        rref={editor}
        editorState={
          contentStorage[params.id]
            ? JSON.stringify(
                JSON.parse(contentStorage[params.id].content).editorState,
              )
            : null
        }
      />
      <View
        minWidth={400}
        width={400}
        margin={10}
        marginStart={20}
        height="calc(100vh - 90px)"
        overflow="auto"
      >
        <Flex direction="column" gap={10}>
          <View height="calc(100vh - 135px)" overflow="auto">
            <Tabs>
              <TabList>
                <Item>Configuration</Item>
                <Item>SEO</Item>
              </TabList>
              <TabPanels>
                <Item>
                  <Flex direction="column" gap={10}>
                    <TextField
                      width="100%"
                      label="Title"
                      isRequired
                      necessityIndicator="icon"
                      value={contentStorage[params.id]?.title}
                    />
                    <TextField
                      width="100%"
                      label="Slug"
                      isRequired
                      necessityIndicator="icon"
                      value={contentStorage[params.id]?.slug}
                    />
                    <Picker
                      width="100%"
                      selectedKey={contentStorage[params.id]?.categoryId}
                      label="Category"
                      items={Object.values(categoryStorage)}
                    >
                      {(item) => <Item key={item.id}>{item.name}</Item>}
                    </Picker>
                    <Image src={contentStorage[params.id]?.coverImage} alt="" />
                    <Flex direction="column">
                      <TextField width="100%" label="Tags" />
                      <TagGroup
                        onRemove={(keys) => console.log(keys)}
                        items={
                          contentStorage[params.id]?.tags
                            .filter((t) => t !== "")
                            .map((t, i) => ({
                              id: i,
                              name: t,
                            })) || []
                        }
                      >
                        {(item) => <Item key={item.id}>{item.name}</Item>}
                      </TagGroup>
                    </Flex>
                  </Flex>
                </Item>
                <Item>Coming soon</Item>
              </TabPanels>
            </Tabs>
          </View>
          <Flex>
            <View flexGrow={1}></View>
            <Button
              variant="accent"
              onPress={() => {
                alert(JSON.stringify(editor.current?.toJSON() || {}));
              }}
            >
              Save
            </Button>
          </Flex>
        </Flex>
      </View>
    </Flex>
  );
}

export const runtime = "edge";
