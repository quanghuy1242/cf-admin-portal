"use client";

import { useCategories } from "@/app/hooks/use-category";
import { useContentUpdate, useContent } from "@/app/hooks/use-content";
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
import { useQueryClient } from "@tanstack/react-query";
import { LexicalEditor } from "lexical";
import { useRef, useState } from "react";

export default function ContentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const {
    setActiveContentId,
    activeContentDrafting,
    setPartiallyDraftingContent,
    clearDraftedContent,
  } = useMainStore((s) => s);
  const queryClient = useQueryClient();

  const [isEditorReady, setEditorReady] = useState(true);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [draftedTagDirty, setDaftedTagDirty] = useState(false);

  const editor = useRef<LexicalEditor>(null);

  usePageMeta({ title: `Editing post with ID ${params.id}` });
  setActiveContentId(params.id);

  const { data: categories } = useCategories();
  const { data: content } = useContent(params.id);
  const { mutate: mutateContent } = useContentUpdate();

  if (!categories || !content) return <>Loading...</>;

  return (
    <Flex>
      <Editor
        ready={isEditorReady}
        rref={editor}
        editorState={JSON.stringify(JSON.parse(content.content).editorState)}
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
                      value={activeContentDrafting.title || content.title}
                      onChange={(title) =>
                        setPartiallyDraftingContent({ title })
                      }
                    />
                    <TextField
                      width="100%"
                      label="Slug"
                      isRequired
                      necessityIndicator="icon"
                      value={activeContentDrafting.slug || content.slug}
                      onChange={(slug) => setPartiallyDraftingContent({ slug })}
                    />
                    <Picker
                      width="100%"
                      selectedKey={
                        activeContentDrafting.categoryId || content.categoryId
                      }
                      label="Category"
                      items={categories}
                      onSelectionChange={(categoryId: any) =>
                        setPartiallyDraftingContent({ categoryId })
                      }
                    >
                      {(item) => <Item key={item.id}>{item.name}</Item>}
                    </Picker>
                    <Image
                      src={
                        activeContentDrafting.coverImage || content.coverImage
                      }
                      alt=""
                    />
                    <Flex direction="column">
                      <TextField
                        value={newTag}
                        width="100%"
                        label="Tags"
                        onChange={setNewTag}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const existing = !draftedTagDirty
                              ? content.tags
                              : activeContentDrafting.tags;
                            setPartiallyDraftingContent({
                              tags: Array.from(
                                new Set([...(existing || []), newTag]),
                              ),
                            });
                            setDaftedTagDirty(true);
                            setNewTag("");
                          }
                        }}
                      />
                      <TagGroup
                        onRemove={(keys) => {
                          const existing = !draftedTagDirty
                            ? content.tags
                            : activeContentDrafting.tags;
                          if (existing) {
                            setPartiallyDraftingContent({
                              tags: Array.from(existing).filter(
                                (t) => !keys.has(t),
                              ),
                            });
                            setDaftedTagDirty(true);
                          }
                        }}
                        items={
                          (
                            (!draftedTagDirty
                              ? content.tags
                              : activeContentDrafting.tags) || []
                          )
                            .filter((t) => t !== "")
                            .map((t, i) => ({
                              id: t,
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
              isDisabled={isButtonLoading}
              onPress={() => {
                editor.current?.getEditorState().read(async () => {
                  if (editor.current) {
                    setIsButtonLoading(true);
                    try {
                      // const d = await updateContent(
                      //   `/api/content/${content.id}`,
                      //   {
                      //     arg: {
                      //       ...activeContentDrafting,
                      //       content: JSON.stringify(editor.current.toJSON()),
                      //     },
                      //   },
                      // );
                      // mutateInfContent();
                      // mutateContent(d, {
                      //   populateCache: (n, t) => n,
                      //   revalidate: false,
                      // });
                      await mutateContent({
                        id: params.id,
                        content: {
                          ...activeContentDrafting,
                          content: JSON.stringify(editor.current.toJSON()),
                        },
                      });
                      // m()
                      clearDraftedContent();
                      setDaftedTagDirty(false);
                    } catch (error) {
                      console.log(error);
                      alert("Something went wrong!");
                    } finally {
                      setIsButtonLoading(false);
                      alert("Saved!");
                    }
                  }
                });
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
