"use client";

import { useCategories } from "@/app/hooks/use-category";
import { useContentCreate } from "@/app/hooks/use-content";
import { usePageMeta } from "@/app/hooks/use-page-meta";
import { Editor } from "@/editor/editor";
import { useMainStore } from "@/stores/providers/main-store";
import {
  Button,
  Content,
  ContextualHelp,
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
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export default function ContentDraftsPage() {
  usePageMeta({ title: "Create a new content" });
  const {
    setActiveContentId,
    activeContentDrafting,
    setPartiallyDraftingContent,
    clearDraftedContent,
  } = useMainStore((s) => s);

  setActiveContentId(null);

  const [isEditorReady, setEditorReady] = useState(true);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [errors, setErrors] = useState([]);
  const router = useRouter();

  const editor = useRef<LexicalEditor>(null);

  const { data: categories } = useCategories();
  const { mutate: createContent } = useContentCreate();

  if (!categories) return <>Loading...</>;
  return (
    <Flex>
      <Editor ready={isEditorReady} rref={editor} editorState={null} />
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
                          <Flex direction="column" gap={10}>
                            {errors.map((e: any) => (
                              <LabeledValue
                                key={(e.path as string[]).join(":")}
                                label={`Field name: ${(e.path as string[]).join(" > ")}`}
                                value={`${e.message}: ${e.code}`}
                              />
                            ))}
                          </Flex>
                        </Content>
                      </InlineAlert>
                    )}

                    <TextField
                      width="100%"
                      label="Title"
                      name="title"
                      isRequired
                      necessityIndicator="icon"
                      value={activeContentDrafting.title}
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
                      value={activeContentDrafting.slug}
                      onChange={(slug) => setPartiallyDraftingContent({ slug })}
                      contextualHelp={
                        <ContextualHelp>
                          <Heading>Tip</Heading>
                          <Content>
                            This field is used for url path, that means it only
                            allows a-zA-Z0-9 and &quot;-&quot;
                          </Content>
                        </ContextualHelp>
                      }
                    />
                    <Picker
                      isRequired
                      width="100%"
                      name="categoryId"
                      selectedKey={activeContentDrafting.categoryId}
                      label="Category"
                      items={categories}
                      onSelectionChange={(categoryId: any) =>
                        setPartiallyDraftingContent({ categoryId })
                      }
                    >
                      {(item) => <Item key={item.id}>{item.name}</Item>}
                    </Picker>
                    <Image
                      src={"https://contents.quanghuy.dev/bg.jpg"}
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
                            setPartiallyDraftingContent({
                              tags: Array.from(
                                new Set([
                                  ...(activeContentDrafting.tags || []),
                                  newTag,
                                ]),
                              ),
                            });
                            setNewTag("");
                          }
                        }}
                      />
                      <TagGroup
                        onRemove={(keys) => {
                          const existing = activeContentDrafting.tags;
                          if (existing) {
                            setPartiallyDraftingContent({
                              tags: Array.from(existing).filter(
                                (t) => !keys.has(t),
                              ),
                            });
                          }
                        }}
                        items={
                          (activeContentDrafting.tags || [])
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
                      await createContent({
                        content: {
                          tags: [],
                          ...activeContentDrafting,
                          content: JSON.stringify(editor.current.toJSON()),
                          coverImage: "https://contents.quanghuy.dev/bg.jpg", // TODO
                        },
                      });
                      clearDraftedContent();
                      setErrors([]);
                      ToastQueue.positive("Created Successfully!", {
                        timeout: 5000,
                      });
                      router.push("/content");
                    } catch (error: any) {
                      if ((error as any)?.error?.error?.issues) {
                        setErrors((error as any).error.error.issues);
                      }
                      ToastQueue.negative(
                        `Error happened when creating the content: ${error.message}`,
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
