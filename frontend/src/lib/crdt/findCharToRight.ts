import { Editor, Point } from "slate"
import { Char } from "../interfaces/Char";
import { Crdt } from "../interfaces/Crdt";
export function findCharToRight(crtd: Crdt, editor: Editor, point: Point): Char {
    const pointAfter = Editor.after(editor, point);
    if (pointAfter === undefined) {
        return { identifiers: [], value: '', counter: 1, siteId: crtd.siteId }
    }
    const [leafNode, _] = Editor.leaf(editor, pointAfter)
    const characters: Char[] = (leafNode as any).characters
    if (characters === undefined) {
        throw new Error(`Unable to get right char. Characters are not defined for leaf node at point ${JSON.stringify(point)}`);
    }
    if (characters.length === 0) {
        return { identifiers: [], value: '', counter: 1, siteId: crtd.siteId }
    }
    //the below is the edge case that will handle when we are adding letter to the end of the line.
    // when we add letter to the end of the line, offset will be len of line after addition
    // thus pointBefore = offset + 1 (wierdly not undefined)
    if (pointAfter.offset > characters.length - 1) {
        return { identifiers: [], value: '', counter: 1, siteId: crtd.siteId }
    }
    return characters[pointAfter.offset]
}

