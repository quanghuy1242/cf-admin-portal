import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useState } from "react";

export const RestoreInputPlugin = ({
  editorState,
}: {
  editorState?: string | null;
}) => {
  const [editor] = useLexicalComposerContext();
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    if (isFirstRender && editorState) {
      setIsFirstRender(false);

      if (editorState) {
        const initialEditorState = editor.parseEditorState(editorState);
        editor.setEditorState(initialEditorState);
        editor.setEditable(true);
        editor.focus();
      }
    } else if (isFirstRender && editorState === null) {
      editor.setEditable(true);
      editor.focus();
    }
  }, [isFirstRender, editor, editorState]);

  return null;
};
