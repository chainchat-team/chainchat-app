import { Editor, Point } from "slate"
import { Char } from "../interfaces/Char";
import { Crdt } from "../interfaces/Crdt";
export function findCharToLeft(crtd: Crdt, editor: Editor, point: Point): Char {
    const pointBefore = Editor.before(editor, point);
    if (pointBefore === undefined) {
        return { identifiers: [], value: '', counter: 1, siteId: crtd.siteId }
    }
    const [leafNode, _] = Editor.leaf(editor, pointBefore)
    const characters: Char[] = (leafNode as any).characters
    if (characters === undefined) {
        throw new Error(`Unable to get left char. Characters are not defined for leaf node at point ${JSON.stringify(point)}`);
    }
    if (characters.length === 0) {
        return { identifiers: [], value: '', counter: 1, siteId: crtd.siteId }
    }
    //the below is the edge case that will handle when we are adding letter to the  of the line.
    if (pointBefore.offset > characters.length - 1) {
        return { identifiers: [], value: '', counter: 1, siteId: crtd.siteId }
    }
    return characters[pointBefore.offset]
}
