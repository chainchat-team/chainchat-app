import { Editor, Point, Transforms } from "slate";
import { Char } from "../interfaces/Char";

// export function insertChar(editor: Editor, char: Char, pointBefore: Point, pointAfter: Point) {
export function insertChar(editor: Editor, char: Char, point: Point) {
    //update the marks of nodes....
    // which node to update??
    // we might have to update multiple nodes... if it is split operation
    // for now keep it simple
    const [leafNode, path] = Editor.leaf(editor, point)
    const updatedCharacters: Char[] = [
        ...(leafNode as any).characters.slice(0, point.offset),
        char,
        ...(leafNode as any).characters.slice(point.offset)
    ];
    const updatedNode = { ...leafNode, characters: updatedCharacters }
    Transforms.setNodes(editor, updatedNode, { at: path });
}