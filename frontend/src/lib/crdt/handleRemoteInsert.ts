import { BaseOperation, Editor, InsertTextOperation, SplitNodeOperation, withoutNormalizing } from "slate";
import { Crdt, CrdtInterface } from "../interfaces/Crdt";
import { Char, CharInterface } from "../interfaces/Char";
export function handleRemoteInsert(crdt: Crdt, editor: Editor, char: Char): void {
    console.log(`---path---`)
    const path = CharInterface.findEditorPath(char, editor)
    //find the leaf node at the path

    const [leafNode, leafNodePath] = Editor.leaf(editor, path) as [any, any]
    //this line is giving me a infinite loop
    const offset = CharInterface.findInsertIndex(char, leafNode.characters)
    console.log(path)
    console.log(leafNode, leafNodePath)
    // console.log(`remote insert offset:${offset}`)
    console.log(`---path---`)


    // let stack: BaseOperation[] = []
    // if (char.value !== '\n') {
    //     const insertTextOperation: InsertTextOperation = {
    //         type: 'insert_text',
    //         path: path,
    //         offset: offset,
    //         text: char.value
    //     }
    //     stack.push(insertTextOperation)
    // } else {
    //     const splitAtLeaf: SplitNodeOperation = {
    //         type: 'split_node',
    //         path: path,
    //         position: offset,
    //         properties: { characters: leafNode.characters } as Partial<Node>
    //     }

    //     const splitAtBlock: SplitNodeOperation = {
    //         type: 'split_node',
    //         path: leafNodePath.slice(0, leafNodePath.length - 1),
    //         position: 1,
    //         properties: {}
    //     }
    //     stack.push(splitAtBlock)
    //     stack.push(splitAtLeaf)
    // }

    // withoutNormalizing(editor, () => {
    //     while (stack && stack.length > 0) {
    //         const op: BaseOperation = stack.pop()!
    //         editor.apply(op)
    //     }
    // })

    // CrdtInterface.handleLocalInsert(crdt, editor, stack.reverse())

}