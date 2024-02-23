import { BaseOperation, Editor, withoutNormalizing } from "slate";
import { Crdt, CrdtInterface } from "../interfaces/Crdt";
import { Char, CharInterface } from "../interfaces/Char";
import { InsertTextOperation } from "../types/InsertTextOperation";
import { SplitNodeOperation } from "../types/SplitNodeOperation";
import { VersionVector, VersionVectorInterface } from "../interfaces/VersionVector";
import { Version } from "../interfaces/Version";
export function handleRemoteInsert(crdt: Crdt, editor: Editor, char: Char, version: Version): void {
  console.log("---handleRemoteInsert-----");

  const path = CharInterface.findEditorPath(char, editor);
  //find the leaf node at the path

  const [leafNode, leafNodePath] = Editor.leaf(editor, path) as [any, any];
  //this line is giving me a infinite loop
  const offset = CharInterface.findInsertIndex(char, leafNode.characters);

  let ops: BaseOperation[] = [];
  if (char.value !== "\n") {
    const insertTextOperation: InsertTextOperation = {
      type: "insert_text",
      path: path,
      offset: offset,
      text: char.value,
      isRemoteOperation: true,
      char: char,
    };
    ops.push(insertTextOperation);
  } else {
    const splitAtLeaf: SplitNodeOperation = {
      type: "split_node",
      path: path,
      position: offset,
      properties: { characters: leafNode.characters } as Partial<Node>,
      isRemoteOperation: true,
      char: char,
    };

    const splitAtBlock: SplitNodeOperation = {
      type: "split_node",
      path: leafNodePath.slice(0, leafNodePath.length - 1),
      position: 1,
      properties: {},
      isRemoteOperation: true,
      char: char,
    };
    ops.push(splitAtLeaf);
    ops.push(splitAtBlock);
  }

  withoutNormalizing(editor, () => {
    ops.forEach((op) => editor.apply(op));
  });

  const versionVector: VersionVector = VersionVectorInterface.update(crdt.versionVector!, version);
  CrdtInterface.setVersionVector(crdt, versionVector);

  console.log("---handleRemoteInsert-----");
}
