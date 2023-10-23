import { Editor, Selection, Range, InsertTextOperation } from "slate";
import { Crdt } from "../interfaces/Crdt";

export function handleLocalPaste(crdt: Crdt, editor: Editor, event: React.ClipboardEvent): void {
    const clipboardData = event.clipboardData
    const pastedText = clipboardData.getData('text/plain');
    const characters = pastedText.split('')

    var selection: Selection;
    if (editor.selection === null) {
        throw new Error(`Failed to paste. Editor selection has value ${editor.selection}.`)
    } else {
        selection = editor.selection
    }

    // remove the characters within the selection
    // remove... will automatically, trigger eimssion of character
    Editor.deleteFragment(editor)
    editor.setSelection({
        anchor: selection.focus,
        focus: selection.focus
    })
    characters.forEach(element => {
        console.log(editor.selection)
        editor.apply(
            {
                type: 'insert_text',
                text: element,
                path: editor.selection!.focus.path,
                offset: editor.selection!.focus.offset
            }
        )
    });
}