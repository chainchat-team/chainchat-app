import { BaseOperation, Editor, withoutNormalizing } from "slate";
import { Crdt, CrdtInterface } from "../interfaces/Crdt";
import { Char, CharInterface } from "../interfaces/Char";
import { BroadcastCrdtEvent } from "../types/BroadcastEventTypes";
import { RemoveTextOperation } from "../types/RemoveTextOperation";
import { MergeNodeOperation } from "../types/MergeNodeOperation";
import { SetSelectionOperation } from "../types/SetSelectionOperation";
import { Version } from "../interfaces/Version";
import { VersionVector, VersionVectorInterface } from "../interfaces/VersionVector";

export function handleRemoteDelete(crdt: Crdt, editor: Editor, char: Char, version: Version): void {
  //find the leaf node at the path
  const path = CharInterface.findEditorPath(char, editor);
  const [leafNode, leafNodePath] = Editor.leaf(editor, path) as [any, any];
  //this line is giving me a infinite loop
  const offset = CharInterface.findInsertIndex(char, leafNode.characters);

  //sanity check that char at the position is the char we want to delete
  const localChar = leafNode.characters[offset];
  //NOTE: what if the char have different siteId??
  if (CharInterface.compareTo(char, localChar) !== 0) {
    throw new Error(
      `Failed to removed ${JSON.stringify(char)}. Char at point:${JSON.stringify({
        path: path,
        offset: offset,
      })} is ${JSON.stringify(localChar)}.`
    );
  }

  const ops: BaseOperation[] = [];
  if (char.value === "\n") {
    const nextBlockPath = [path[0] + 1];
    const mergeBlockOperation: MergeNodeOperation = {
      type: "merge_node",
      path: nextBlockPath,
      position: 1,
      properties: {},
      isRemoteOperation: true,
    };
    const setSelection: SetSelectionOperation = {
      type: "set_selection",
      newProperties: {
        anchor: { path: leafNodePath, offset: leafNode.text.length },
        focus: { path: leafNodePath, offset: leafNode.text.length },
      },
      properties: editor.selection,
      isRemoteOperation: true,
    };
    const mergeLeafOperation: MergeNodeOperation = {
      type: "merge_node",
      path: [path[0], 1],
      position: leafNode.text.length,
      properties: {},
      isRemoteOperation: true,
    };
    ops.push(mergeBlockOperation);
    ops.push(setSelection);
    ops.push(mergeLeafOperation);
  } else {
    const deleteOp: RemoveTextOperation = {
      type: "remove_text",
      path: path,
      offset: offset,
      text: char.value,
      isRemoteOperation: true,
    };
    ops.push(deleteOp);
  }

  withoutNormalizing(editor, () => {
    ops.forEach((op) => editor.apply(op));
  });
  const versionVector: VersionVector = VersionVectorInterface.update(crdt.versionVector!, version);
  CrdtInterface.setVersionVector(crdt, versionVector);
}
