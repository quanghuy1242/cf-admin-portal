import { getSelectedNode } from "./utils/get-selected-node";
import {
  ActionGroup,
  Divider,
  Flex,
  Item,
  Key,
  Picker,
  Text,
} from "@adobe/react-spectrum";
import { $isLinkNode } from "@lexical/link";
import {
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
} from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
} from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import {
  $findMatchingParent,
  $getNearestNodeOfType,
  mergeRegister,
} from "@lexical/utils";
import Capitals from "@spectrum-icons/workflow/Capitals";
import Code from "@spectrum-icons/workflow/Code";
import Feedback from "@spectrum-icons/workflow/Feedback";
import Link from "@spectrum-icons/workflow/Link";
import Redo from "@spectrum-icons/workflow/Redo";
import TagBold from "@spectrum-icons/workflow/TagBold";
import TagItalic from "@spectrum-icons/workflow/TagItalic";
import TaskList from "@spectrum-icons/workflow/TaskList";
import TextAlignCenter from "@spectrum-icons/workflow/TextAlignCenter";
import TextAlignJustify from "@spectrum-icons/workflow/TextAlignJustify";
import TextAlignLeft from "@spectrum-icons/workflow/TextAlignLeft";
import TextAlignRight from "@spectrum-icons/workflow/TextAlignRight";
import TextBulleted from "@spectrum-icons/workflow/TextBulleted";
import TextNumbered from "@spectrum-icons/workflow/TextNumbered";
import TextStrikethrough from "@spectrum-icons/workflow/TextStrikethrough";
import Underline from "@spectrum-icons/workflow/Underline";
import Undo from "@spectrum-icons/workflow/Undo";
import {
  $createParagraphNode,
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  $isRootOrShadowRoot,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  ElementFormatType,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import { useCallback, useEffect, useRef, useState } from "react";

const LowPriority = 1;

const blockTypeToBlockName = {
  bullet: "Bulleted List",
  check: "Check List",
  code: "Code Block",
  h1: "Heading 1",
  h2: "Heading 2",
  h3: "Heading 3",
  h4: "Heading 4",
  h5: "Heading 5",
  h6: "Heading 6",
  number: "Numbered List",
  paragraph: "Normal",
  quote: "Quote",
};

export const ToolbarEditor = ({ ready }: { ready: boolean }) => {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);

  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [blockType, setBlockType] =
    useState<keyof typeof blockTypeToBlockName>("paragraph");
  const [elementFormat, setElementFormat] = useState<ElementFormatType>("left");

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();

    if ($isRangeSelection(selection)) {
      // Update text format
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));

      const node = getSelectedNode(selection);
      const parent = node.getParent();

      // Update links
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }

      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
              const parent = e.getParent();
              return parent !== null && $isRootOrShadowRoot(parent);
            });

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow();
      }

      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);

      if (elementDOM !== null) {
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(
            anchorNode,
            ListNode,
          );
          const type = parentList
            ? parentList.getListType()
            : element.getListType();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          if (type in blockTypeToBlockName) {
            setBlockType(type as keyof typeof blockTypeToBlockName);
          }
        }
      }
      let matchingParent;
      if ($isLinkNode(parent)) {
        // If node is a link, we need to fetch the parent paragraph node to set format
        matchingParent = $findMatchingParent(
          node,
          (parentNode) => $isElementNode(parentNode) && !parentNode.isInline(),
        );
      }

      setElementFormat(
        $isElementNode(matchingParent)
          ? matchingParent.getFormatType()
          : $isElementNode(node)
            ? node.getFormatType()
            : parent?.getFormatType() || "left",
      );
    }
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, _newEditor) => {
          $updateToolbar();
          return false;
        },
        LowPriority,
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LowPriority,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority,
      ),
    );
  }, [editor, $updateToolbar]);

  const actions = [
    [
      {
        key: "undo",
        disabled: !canUndo,
        icon: <Undo />,
        onClick: () => editor.dispatchCommand(UNDO_COMMAND, undefined),
      },
      {
        key: "redo",
        disabled: !canUndo,
        icon: <Redo />,
        onClick: () => editor.dispatchCommand(REDO_COMMAND, undefined),
      },
    ],
    [
      {
        key: "bold",
        icon: <TagBold />,
        onClick: () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold"),
      },
      {
        key: "italic",
        icon: <TagItalic />,
        onClick: () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic"),
      },
      {
        key: "underline",
        icon: <Underline />,
        onClick: () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline"),
      },
      {
        key: "strikethrough",
        icon: <TextStrikethrough />,
        onClick: () =>
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough"),
      },
    ],
    [
      {
        key: "link",
        icon: <Link />,
        onClick: () => {},
      },
    ],
    [
      {
        key: "left",
        icon: <TextAlignLeft />,
        onClick: () => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left"),
      },
      {
        key: "center",
        icon: <TextAlignCenter />,
        onClick: () => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center"),
      },
      {
        key: "right",
        icon: <TextAlignRight />,
        onClick: () => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right"),
      },
      {
        key: "justify",
        icon: <TextAlignJustify />,
        onClick: () =>
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify"),
      },
    ],
  ];

  const allkeys = actions.flat().map((a) => a.key);
  const onclickMap = Object.fromEntries(
    actions.map((as, i) => [
      i.toString(),
      Object.fromEntries(as.map((a) => [a.key, a.onClick])),
    ]),
  );
  const handleToolbarOnChange = (groupIndex: number) => (e: Key) =>
    onclickMap[groupIndex][e.toString()]();

  const textformaters = [
    {
      key: "paragraph",
      label: blockTypeToBlockName["paragraph"],
      icon: <TextAlignJustify />,
      onClick: () => {
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createParagraphNode());
          }
        });
      },
    },
    {
      key: "h1",
      label: blockTypeToBlockName["h1"],
      icon: <Capitals />,
      onClick: () => {
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createHeadingNode("h1"));
          }
        });
      },
    },
    {
      key: "h2",
      label: blockTypeToBlockName["h2"],
      icon: <Capitals />,
      onClick: () => {
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createHeadingNode("h2"));
          }
        });
      },
    },
    {
      key: "h3",
      label: blockTypeToBlockName["h3"],
      icon: <Capitals />,
      onClick: () => {
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createHeadingNode("h3"));
          }
        });
      },
    },
    {
      key: "code",
      label: blockTypeToBlockName["code"],
      icon: <Code />,
      onClick: () => {},
    },
    {
      key: "quote",
      label: blockTypeToBlockName["quote"],
      icon: <Feedback />,
      onClick: () => {
        if (blockType !== "quote") {
          editor.update(() => {
            const selection = $getSelection();
            $setBlocksType(selection, () => $createQuoteNode());
          });
        }
      },
    },
    {
      key: "bullet",
      label: blockTypeToBlockName["bullet"],
      icon: <TextBulleted />,
      onClick: () => {
        if (blockType !== "bullet") {
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
        }
      },
    },
    {
      key: "check",
      label: blockTypeToBlockName["check"],
      icon: <TaskList />,
      onClick: () => {
        // if (blockType !== "check") {
        //   editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
        // }
      },
    },
    {
      key: "number",
      label: blockTypeToBlockName["number"],
      icon: <TextNumbered />,
      onClick: () => {
        if (blockType !== "number") {
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
        }
      },
    },
  ];
  const pickerOnClickMap = Object.fromEntries(
    textformaters.map((t) => [t.key, t.onClick]),
  );
  const handleBlockFormaterOnChange = (e: Key) => pickerOnClickMap[e]();

  return (
    <div className="toolbar pb-2" ref={toolbarRef}>
      <Flex gap={5}>
        <Picker
          items={textformaters}
          selectedKey={blockType}
          onSelectionChange={handleBlockFormaterOnChange}
        >
          {(item) => (
            <Item key={item.key}>
              {item.icon}
              <Text>{item.label}</Text>
            </Item>
          )}
        </Picker>
        {actions.map((a, i) => (
          <>
            <ActionGroup
              key={i}
              items={a}
              isQuiet
              density="compact"
              onAction={handleToolbarOnChange(i)}
              selectionMode="multiple"
              disabledKeys={
                ready
                  ? [...(canUndo ? [] : ["undo"]), ...(canRedo ? [] : ["redo"])]
                  : allkeys
              }
              selectedKeys={[
                ...(!isBold ? [] : ["bold"]),
                ...(!isItalic ? [] : ["italic"]),
                ...(!isUnderline ? [] : ["underline"]),
                ...(!isStrikethrough ? [] : ["strikethrough"]),
                ...(!isLink ? [] : ["link"]),
                elementFormat || "left",
              ]}
            >
              {(item) => <Item key={item.key}>{item.icon}</Item>}
            </ActionGroup>
            <Divider />
          </>
        ))}
      </Flex>
    </div>
  );
};
