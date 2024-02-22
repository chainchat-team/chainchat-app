
import { Editor, RemoveNodeOperation } from "slate";
import { Crdt } from "../interfaces/Crdt";
import { Char } from "../interfaces/Char";
export function handleRemoveNodeOp(crtd: Crdt, editor: Editor, operations: RemoveNodeOperation[]): Char[] {

    if (operations[0].type !== 'remove_node') {
        throw new Error(`Invalid operation type ${operations[0].type} for handleRemoveNodeOp.`)
    }
    if (operations.length <= 0) {
        return []
    }

    const cache: Char[] = []
    const operation = operations[0]
    const leafNode = (operation.node as any).children[0]
    if ((leafNode as any).characters === undefined) {
        throw new Error(`Failed to remove Char from characters array on remove_node operation. Characters array is not defined for leaf node at path:${operation.path}`)
    }
    const characters: Char[] = (leafNode as any).characters
    characters.forEach(char => cache.push(char))
    return cache
}