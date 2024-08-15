import lexicalNodes from "@/editor/nodes";
import { useMainStore } from "@/stores/providers/main-store";
import { createHeadlessEditor } from "@lexical/headless";
import { $generateHtmlFromNodes } from "@lexical/html";
import { useEffect, useMemo, useState } from "react";

export const useLexicalHTML = (str?: string | null) => {
  const [previewHTML, setPreviewHTML] = useState("");
  const editor = useMemo(
    () =>
      createHeadlessEditor({
        nodes: [...lexicalNodes],
        onError: (error) => {
          console.error(error);
        },
      }),
    [],
  );
  useEffect(() => {
    if (str) {
      const body = JSON.stringify(JSON.parse(str).editorState);
      editor.setEditorState(editor.parseEditorState(body));
      editor.update(() => {
        const html = $generateHtmlFromNodes(editor);
        setPreviewHTML(html);
      });
    } else {
      setPreviewHTML("");
    }
  }, [editor, str]);
  return previewHTML;
};
