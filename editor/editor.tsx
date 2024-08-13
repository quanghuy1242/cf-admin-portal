import lexicalNodes from "./nodes";
import { RestoreInputPlugin } from "./plugins/restore-editor-state-plugin";
import { editorTheme } from "./theme";
import { ToolbarEditor } from "./toolbar";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { ClickableLinkPlugin } from "@lexical/react/LexicalClickableLinkPlugin";
import {
  LexicalComposer,
  InitialConfigType,
} from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HashtagPlugin } from "@lexical/react/LexicalHashtagPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import { LexicalEditor } from "lexical";

export const Editor = ({
  editorState,
  ready,
}: {
  editorState?: string | null;
  ready: boolean;
}) => {
  const initialConfig: InitialConfigType = {
    editable: false,
    nodes: lexicalNodes,
    theme: editorTheme,
    namespace: "admin.editor.",
    onError: function (error: Error, editor: LexicalEditor): void {
      throw error;
    },
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="rounded-sm rounded-tl-xl flex-grow text-black relative leading-5 text-left font-[400]">
        <ToolbarEditor ready={ready} />
        <div className="bg-white relative overflow-auto h-[calc(100vh-110px)]">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="min-h-[150] resize-none text-sm caret-slate-800 relative outline-0 p-4"
                aria-placeholder={"Typing something"}
                placeholder={
                  <div className="text-gray-500 overflow-hidden absolute top-4 left-4 text-sm select-none inline-block pointer-events-none">
                    {ready ? <>Type something...</> : <>Loading...</>}
                  </div>
                }
              />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <RestoreInputPlugin editorState={editorState} />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <ListPlugin />
          <CheckListPlugin />
          <HorizontalRulePlugin />
          <HashtagPlugin />
          <TablePlugin hasCellMerge={true} hasCellBackgroundColor={true} />
          <ClickableLinkPlugin />
          <TabIndentationPlugin />
        </div>
      </div>
    </LexicalComposer>
  );
};
