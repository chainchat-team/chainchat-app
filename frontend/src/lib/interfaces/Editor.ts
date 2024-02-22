import { Editor as SlateEditor } from "slate";
import { lastValidLeaf } from "../editor/lastValidLeaf";

export const Editor = {
    ...SlateEditor,
    lastValidLeaf: (editor: SlateEditor) => lastValidLeaf(editor)
}
