import { useLexicalHTML } from "@/app/hooks/use-lexical-preview";
import { useMainStore } from "@/stores/providers/main-store";
import { IContent } from "@/types/content";
import {
  Content,
  Flex,
  Heading,
  IllustratedMessage,
  Image,
  Item,
  LabeledValue,
  TabList,
  TabPanels,
  Tabs,
  TagGroup,
  ToggleButton,
} from "@adobe/react-spectrum";
import NoSearchResults from "@spectrum-icons/illustrations/NoSearchResults";
import PrintPreview from "@spectrum-icons/workflow/PrintPreview";

export const PreviewButton = ({ item }: { item: IContent }) => {
  const { rowIdForPreview, setRowIdForPreview, clearRowPreview } = useMainStore(
    (s) => s,
  );
  return (
    <ToggleButton
      UNSAFE_className="action-button"
      isQuiet
      isSelected={rowIdForPreview === item.id}
      onChange={(e) => (e ? setRowIdForPreview(item.id) : clearRowPreview())}
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
};

export const PreviewPannel = ({ content }: { content: IContent | null }) => {
  const previewHTML = useLexicalHTML(content?.content);
  if (!content) {
    return (
      <Flex direction="column" width="100%">
        <IllustratedMessage>
          <NoSearchResults />
          <Heading level={1}>It&apos;s empty here</Heading>
          <Content>Select a row to preview.</Content>
        </IllustratedMessage>
      </Flex>
    );
  }
  return (
    <Tabs>
      <TabList>
        <Item>Content</Item>
        <Item>Information</Item>
      </TabList>
      <TabPanels>
        <Item>
          <div
            style={{
              overflow: "auto",
              height: "calc(100vh - 140px)",
              paddingRight: 10,
            }}
          >
            <Heading level={2} UNSAFE_className="text-2xl mb-2">
              {content?.title || ""}
            </Heading>
            <Image src={content?.coverImage} alt="ALTT" />
            <div dangerouslySetInnerHTML={{ __html: previewHTML }}></div>
          </div>
        </Item>
        <Item>
          <div
            style={{
              height: "calc(100vh - 140px)",
              overflow: "auto",
            }}
          >
            <Flex direction="column" gap={10} marginY={10}>
              <LabeledValue label="Title" value={content?.title} />
              <Image src={content?.coverImage} alt="ALT" />
              <TagGroup
                items={
                  content.tags
                    .filter((t) => t !== "")
                    .map((t, i) => ({
                      id: t,
                      name: t,
                    })) || []
                }
                label="Tags"
                maxRows={3}
              >
                {(item) => <Item key={item.id}>{item.name}</Item>}
              </TagGroup>
              <LabeledValue
                label="Created"
                value={new Date(content.created).toLocaleString()}
              />
            </Flex>
          </div>
        </Item>
      </TabPanels>
    </Tabs>
  );
};
