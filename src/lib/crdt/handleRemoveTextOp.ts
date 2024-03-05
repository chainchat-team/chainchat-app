
import { BaseOperation, Editor, RemoveTextOperation, SplitNodeOperation, Text, Transforms } from "slate";
import { Crdt, CrdtInterface } from "../interfaces/Crdt";
import { Char } from "../interfaces/Char";
export function handleRemoveTextOp(crtd: Crdt, editor: Editor, operations: RemoveTextOperation[]): Char[] {

    if (operations[0].type !== 'remove_text') {
        throw new Error(`Invalid operation type ${operations[0].type} for handleRemoveTextOp.`)
    }
    if (operations.length <= 0) {
        return []
    }


    const cache: Char[] = []

    const operation: RemoveTextOperation = operations[0]
    const { path, offset } = operation
    const [leafNode, leafNodePath] = Editor.leaf(editor, { path: path, offset: offset })
    const characters: Char[] = (leafNode as any).characters

    if ((leafNode as any).characters === undefined) {
        throw new Error(`Failed to remove Char from characters array on remove_text operation. Characters array is not defined for leaf node at path:${operation.path}`)
    }
    if (characters.length === 0) {
        throw new Error(`Failed remove Char from characters array on remove_text operation. Characters array is empty.`)
    }
    const endOffset = offset + (operation.text.length - 1)
    const updatedCharacters = [...characters.slice(0, offset), ...characters.slice(endOffset + 1)];
    const updatedNode = { ...leafNode, characters: updatedCharacters }
    Transforms.setNodes(editor, updatedNode, { at: leafNodePath });
    characters.slice(offset, endOffset + 1).forEach(char => cache.push(char))

    return cache
}