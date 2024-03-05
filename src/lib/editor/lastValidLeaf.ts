import { Editor, NodeEntry } from "slate";

export function lastValidLeaf(editor: Editor): NodeEntry {
    var [lastLineLeaf, lastLineLeafPath] = Editor.last(editor, [])
    var lastLineLength = (lastLineLeaf as any).characters.length;
    if (lastLineLength) {
        return [lastLineLeaf, lastLineLeafPath]
    }
    const pointBefore = Editor.before(editor, lastLineLeafPath)
    if (pointBefore === undefined) {
        throw new Error(`There are no points before Path:${lastLineLeafPath}.`);
    }
    return Editor.leaf(editor, pointBefore)
}