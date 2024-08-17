"use client";

import { useCategories } from "@/app/hooks/use-category";
import { useContentUpdate, useContent } from "@/app/hooks/use-content";
import { usePageMeta } from "@/app/hooks/use-page-meta";
import { Editor } from "@/editor/editor";
import { useMainStore } from "@/stores/providers/main-store";
import {
  Button,
  Content,
  Flex,
  Heading,
  Image,
  InlineAlert,
  Item,
  LabeledValue,
  Picker,
  TabList,
  TabPanels,
  Tabs,
  TagGroup,
  TextField,
  View,
} from "@adobe/react-spectrum";
import { ToastQueue } from "@react-spectrum/toast";
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

  const [isEditorReady, setEditorReady] = useState(true);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [draftedTagDirty, setDaftedTagDirty] = useState(false);
  const [errors, setErrors] = useState([]);

  const editor = useRef<LexicalEditor>(null);

  setActiveContentId(params.id);

  const { data: categories } = useCategories();
  const { data: content } = useContent(params.id);
  const { mutate: mutateContent } = useContentUpdate();
  usePageMeta({ title: `[Editing] ${content?.title || "Loading"}` });

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
                    {!Object.keys(errors).length ? (
                      <></>
                    ) : (
                      <InlineAlert variant="negative" margin={10}>
                        <Heading>Validation Errors</Heading>
                        <Content>
                          {errors.map((e: any) => (
                            <LabeledValue
                              key={(e.path as string[]).join(":")}
                              label={`Field name: ${(e.path as string[]).join(" > ")}`}
                              value={`${e.message}: ${e.code}`}
                            />
                          ))}
                        </Content>
                      </InlineAlert>
                    )}

                    <TextField
                      width="100%"
                      label="Title"
                      name="title"
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
                      name="slug"
                      isRequired
                      necessityIndicator="icon"
                      value={activeContentDrafting.slug || content.slug}
                      onChange={(slug) => setPartiallyDraftingContent({ slug })}
                    />
                    <Picker
                      width="100%"
                      name="categoryId"
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
                        name="newTag"
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
                      await mutateContent({
                        id: params.id,
                        content: {
                          ...activeContentDrafting,
                          content: JSON.stringify(editor.current.toJSON()),
                        },
                      });
                      clearDraftedContent();
                      setDaftedTagDirty(false);
                      setErrors([]);
                      ToastQueue.positive("Saved Successfully!", {
                        timeout: 5000,
                      });
                    } catch (error) {
                      setErrors((error as any).error.error.issues);
                      ToastQueue.negative(
                        "Error happened when saving the draft!",
                        { timeout: 5000 },
                      );
                    } finally {
                      setIsButtonLoading(false);
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
