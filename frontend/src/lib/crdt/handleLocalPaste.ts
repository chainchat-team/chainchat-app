import { BaseOperation, Editor, Point, Selection, SetSelectionOperation, withoutNormalizing } from "slate";
import { Crdt } from "../interfaces/Crdt";
import { SplitNodeOperation } from "../types/SplitNodeOperation";
import { InsertTextOperation } from "../types/InsertTextOperation";

export function handleLocalPaste(crdt: Crdt, editor: Editor, event: React.ClipboardEvent): void {
    const clipboardData = event.clipboardData
    const pastedText = clipboardData.getData('text/plain');
    var characters = pastedText.split('')
    if (characters[characters.length - 1] === '\n') {
        characters.pop()
    }
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

    //build operations for each element
    const ops: BaseOperation[] = []
    characters.forEach(element => {
        console.log(editor.selection)
        var op: SplitNodeOperation | InsertTextOperation;
        if (element === '\n') {
            const splitAtLeaf: SplitNodeOperation = {
                type: 'split_node',
                path: editor.selection!.focus.path,
                position: editor.selection!.focus.offset,
                properties: { characters: [] } as Partial<Node>
            }

            const splitAtBlock: SplitNodeOperation = {
                type: 'split_node',
                path: editor.selection!.focus.path.slice(0, -1),
                position: 1,
                properties: {}
            }

            withoutNormalizing(editor, () => {
                editor.apply(splitAtLeaf);
                editor.apply(splitAtBlock);
            })

        } else {
            const insertTextOp: InsertTextOperation = {
                type: 'insert_text',
                text: element,
                path: editor.selection!.focus.path,
                offset: editor.selection!.focus.offset
            }
            // ops.push(insertTextOp)
            editor.apply(insertTextOp)
        }
    });


}