import { Editor, SplitNodeOperation, Transforms } from "slate";
import { Char } from "../interfaces/Char";

export function splitLine(editor: Editor, operations: SplitNodeOperation[]): void {
    if (operations.length > 1) {
        throw new Error(`Failed to split line. Passed operation array length is ${operations.length} but needs to be 1.`)
    }
    const newNode1Path: number[] = [...operations[0].path]
    const newNode2Path: number[] = [...operations[0].path].map((val, idx, arr) => (idx === arr.length - 1 ? val + 1 : val))
    const [leafNode1, path1] = Editor.leaf(editor, newNode1Path)
    const [leafNode2, path2] = Editor.leaf(editor, newNode2Path)

    //update the characters array in the nodes
    const originalCharacters: Char[] = (leafNode1 as any).characters
    const updatedNode1 = { ...leafNode1, characters: originalCharacters.slice(0, operations[0].position) }
    const updatedNode2 = { ...leafNode2, characters: originalCharacters.slice(operations[0].position) }

    //replace the old nodes with new nodes
    Transforms.setNodes(editor, updatedNode1, { at: path1 })
    Transforms.setNodes(editor, updatedNode2, { at: path2 })

}