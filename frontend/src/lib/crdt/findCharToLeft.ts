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
    //edge case: the below is the edge case that will handle when we are adding letter to the end of the line.
    //Note: This case is when you are adding at the end of the line, but Char for `\n` doesn't exist yet.
    // if the char for `\n` does exit that pointBefore.offset === character.length
    // basically, if it's impossible for us to extract char from characters then do this
    if (pointBefore.offset > characters.length - 1) {
        return { identifiers: [], value: '', counter: 1, siteId: crtd.siteId }
    }
    //edge case: if the given point has offset 0, that means insertion happend at the start of the line.
    //this means that the offset returned from pointBefore will be incorrect
    //because `.before` is not aware that characters array will container additional char for `\n` at the every end of the line.
    //Note: This case is when you are adding at the end of the line, but Char for `\n` does exist.
    const offset = point.offset !== 0 ? pointBefore.offset : characters.length - 1
    return characters[offset]
}
