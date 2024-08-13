import { ActionGroup, Flex, Item, Key } from "@adobe/react-spectrum";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import Redo from "@spectrum-icons/workflow/Redo";
import TagBold from "@spectrum-icons/workflow/TagBold";
import TagItalic from "@spectrum-icons/workflow/TagItalic";
import TextAlignCenter from "@spectrum-icons/workflow/TextAlignCenter";
import TextAlignJustify from "@spectrum-icons/workflow/TextAlignJustify";
import TextAlignLeft from "@spectrum-icons/workflow/TextAlignLeft";
import TextAlignRight from "@spectrum-icons/workflow/TextAlignRight";
import TextStrikethrough from "@spectrum-icons/workflow/TextStrikethrough";
import Underline from "@spectrum-icons/workflow/Underline";
import Undo from "@spectrum-icons/workflow/Undo";
import {
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";

const LowPriority = 1;

function Divider() {
  return <div className="divider" />;
}

export const ToolbarEditor = ({ ready }: { ready: boolean }) => {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);

  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // Update text format
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
    }
  }, []);

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

  interface IToolbarActionItem {
    key: string;
    disabled?: boolean;
    onClick: () => void;
    icon: ReactNode;
  }

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

  return (
    <div className="toolbar" ref={toolbarRef}>
      <Flex gap={5}>
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
