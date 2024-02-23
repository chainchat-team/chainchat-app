import { Editor, Point } from "slate";
import { Char } from "../interfaces/Char";
import { Crdt } from "../interfaces/Crdt";
export function findCharToRight(crtd: Crdt, editor: Editor, point: Point): Char {
  const pointAfter = Editor.after(editor, point);

  if (pointAfter === undefined) {
    return { identifiers: [], value: "", counter: 1, siteId: crtd.siteId, peerId: crtd.peerId! };
  }
  const [leafNode, _] = Editor.leaf(editor, pointAfter);
  const characters: Char[] = (leafNode as any).characters;
  if (characters === undefined) {
    throw new Error(
      `Unable to get right char. Characters are not defined for leaf node at point ${JSON.stringify(point)}`
    );
  }
  if (characters.length === 0) {
    return { identifiers: [], value: "", counter: 1, siteId: crtd.siteId, peerId: crtd.peerId! };
  }
  // sometimes pointAfter.offset can be 0,
  //eg. Imagine insertion at the end of line.
  // The next character will be in in a new line offset 0
  // thus, we need to bound it to 0, eg. -1 will cause problems
  const nextLetterIndexInCharactersArray = Math.max(pointAfter.offset - 1, 0);

  if (nextLetterIndexInCharactersArray > characters.length - 1) {
    return { identifiers: [], value: "", counter: 1, siteId: crtd.siteId, peerId: crtd.peerId! };
  }
  return characters[nextLetterIndexInCharactersArray];
}
