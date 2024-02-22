
import { BaseOperation, Editor, MergeNodeOperation, Operation, RemoveNodeOperation, RemoveTextOperation, SplitNodeOperation, Text, Transforms, Node } from "slate";
import { Crdt } from "../interfaces/Crdt";
import { Char } from "../interfaces/Char";
export function handleMergeNodeOp(crtd: Crdt, editor: Editor, operations: MergeNodeOperation[]): Char[] {

    if (operations[0].type !== 'merge_node') {
        throw new Error(`Invalid operation type ${operations[0].type} for handleMergeNodeOp.`)
    }
    if (operations.length <= 0) {
        return []
    }

    const cache: Char[] = []
    const operation = operations[0]
    const [operationNode, operationNodePath] = Editor.node(editor, operation.path)
    if (Text.isText(operationNode)) {
        return []
    }

    // extract the leaf node of this block
    const [[topNode, topNodePath], [bottomNode, bottomNodePath]] = [...Node.texts(editor, { from: [operation.path[0] - 1], to: operation.path })]

    if (topNode === undefined) {
        throw new Error(`No leaf node found at path:${[operation.path[0] - 1]}.`)
    }
    if (bottomNode === undefined) {
        throw new Error(`No leaf node found at path:${operation.path}.`)
    }

    // handle characters array 
    const length = (topNode as any).characters.length;
    const updatedCharacters = [
        ...(topNode as any).characters.slice(0, length - 1),
        ...(bottomNode as any).characters
    ]

    // update the characters array
    const updatedTopNode = { ...topNode, characters: updatedCharacters }
    const updatedbottomNode = { ...bottomNode, characters: updatedCharacters }
    Transforms.setNodes(editor, updatedTopNode, { at: topNodePath })
    Transforms.setNodes(editor, updatedbottomNode, { at: bottomNodePath })

    // add the newLine char was removed to the cache
    cache.push((topNode as any).characters[length - 1])

    return cache

}