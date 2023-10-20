import { BaseOperation, Editor, RemoveTextOperation, Transforms, Text, Node, Descendant } from "slate";
import { Crdt } from "../interfaces/Crdt";
import { Char } from "../interfaces/Char";

export function handleLocalDelete(crdt: Crdt, editor: Editor, operations: BaseOperation[]): Char[] {
    const acceptedOperations = ['remove_text', 'remove_node', 'merge_node']
    const deleteOperations = operations.filter(op => acceptedOperations.includes(op.type))
    if (deleteOperations.length <= 0) {
        return []
    }

    const cache: Char[] = []
    for (let i = 0; i < deleteOperations.length; i++) {
        const operation = deleteOperations[i]
        if (operation.type === 'remove_text') {
            const { path, offset } = (operation as RemoveTextOperation)
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
            cache.push(characters[offset])
        } else if (operation.type === 'remove_node') {
            const leafNode = (operation.node as any).children[0]
            if ((leafNode as any).characters === undefined) {
                throw new Error(`Failed to remove Char from characters array on remove_node operation. Characters array is not defined for leaf node at path:${operation.path}`)
            }
            const characters: Char[] = (leafNode as any).characters
            characters.forEach(char => cache.push(char))
        } else if (operation.type === 'merge_node') {
            const [operationNode, operationNodePath] = Editor.node(editor, operation.path)
            if (Text.isText(operationNode)) {
                continue
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
        }
    }
    return []

}