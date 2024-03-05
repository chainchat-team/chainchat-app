import { BaseOperation, Editor, MergeNodeOperation, Point, RemoveNodeOperation, RemoveTextOperation } from "slate";
import { Char } from "./Char";
import { generateChar } from "../crdt/generateChar";
import { retrieveStrategy } from "../crdt/retrieveStrategy";
import { handleLocalInsert } from "../crdt/handleLocalInsert";
import { findCharToLeft } from "../crdt/findCharToLeft";
import { findCharToRight } from "../crdt/findCharToRight";
import { handleRemoteInsert } from "../crdt/handleRemoteInsert";
import { handleLocalDelete } from "../crdt/handleLocalDelete";
import { handleRemoteDelete } from "../crdt/handleRemoteDelete";
import { handleLocalPaste } from "../crdt/handleLocalPaste";
import { handleInsertTextOp } from "../crdt/handleInsertTextOp";
import { handleSplitNodeOp } from "../crdt/handleSplitNodeOp";
import { handleRemoveTextOp } from "../crdt/handleRemoveTextOp";
import { handleRemoveNodeOp } from "../crdt/handleRemoveNodeOp";
import { handleMergeNodeOp } from "../crdt/handleMergeNodeOp";
import { InsertTextOperation } from "../types/InsertTextOperation";
import { SplitNodeOperation } from "../types/SplitNodeOperation";
import { VersionVector } from "./VersionVector";
import { setVersionVector } from "../crdt/setVersionVector";
import { incrementVersionVector } from "../crdt/incrementVersionVector";
import { Version } from "./Version";
import { BroadcastCrdtEvent } from "../types/BroadcastEventTypes";
import { addToDeletionBuffer } from "../crdt/addToDeletionBuffer";
import { removeFromDeletionBuffer } from "../crdt/removeFromDeletionBuffer";
import { processDeletionBuffer } from "../crdt/processDeletionBuffer";
import { insertChar } from "../crdt/insertChar";
import { splitLine } from "../crdt/splitLine";
export interface Crdt {
  // Core state
  base: number;
  boundary: number;
  siteId: string;
  strategyCache: boolean[];
  peerId: string | null;
  versionVector: VersionVector | null;
  deletionBuffer: BroadcastCrdtEvent[];
}

export interface CrdtInterface {
  retrieveStrategy: (crdt: Crdt, depth: number) => boolean;
  generateChar: (crdt: Crdt, char1: Char, char2: Char, value: string) => Char;
  handleLocalInsert: (crdt: Crdt, editor: Editor, operation: BaseOperation[]) => Char[];
  handleLocalDelete: (crdt: Crdt, editor: Editor, operation: BaseOperation[]) => Char[];
  handleLocalPaste: (crdt: Crdt, editor: Editor, event: React.ClipboardEvent) => void;
  handleRemoteInsert: (crdt: Crdt, editor: Editor, char: Char, version: Version) => void;
  handleRemoteDelete: (crdt: Crdt, editor: Editor, char: Char, version: Version) => void;
  findCharToLeft: (crdt: Crdt, editor: Editor, point: Point) => Char | undefined;
  findCharToRight: (crdt: Crdt, editor: Editor, point: Point) => Char;
  insertChar: (editor: Editor, char: Char, point: Point) => void;
  splitLine: (editor: Editor, operations: SplitNodeOperation[]) => void;

  /*--*/
  handleInsertTextOp: (crdt: Crdt, editor: Editor, operation: InsertTextOperation[]) => Char[];
  handleSplitNodeOp: (crdt: Crdt, editor: Editor, operation: SplitNodeOperation[]) => Char[];
  handleRemoveTextOp: (crdt: Crdt, editor: Editor, operation: RemoveTextOperation[]) => Char[];
  handleRemoveNodeOp: (crdt: Crdt, editor: Editor, operation: RemoveNodeOperation[]) => Char[];
  handleMergeNodeOp: (crdt: Crdt, editor: Editor, operation: MergeNodeOperation[]) => Char[];

  /** */
  setVersionVector: (crdt: Crdt, versionVector: VersionVector) => void;
  incrementVersionVector: (crdt: Crdt) => void;

  /** Deletion buffer */
  addToDeletionBuffer: (crdt: Crdt, operation: BroadcastCrdtEvent) => void;
  removeFromDeletionBuffer: (crdt: Crdt, operation: BroadcastCrdtEvent) => BroadcastCrdtEvent | null;
  processDeletionBuffer: (crdt: Crdt, editor: Editor) => void;
}

export const CrdtInterface: CrdtInterface = {
  generateChar: (...args) => generateChar(...args),
  retrieveStrategy: (...args) => retrieveStrategy(...args),
  handleLocalInsert: (...args) => handleLocalInsert(...args),
  handleLocalDelete: (...args) => handleLocalDelete(...args),
  handleLocalPaste: (...args) => handleLocalPaste(...args),
  handleRemoteInsert: (...args) => handleRemoteInsert(...args),
  handleRemoteDelete: (...args) => handleRemoteDelete(...args),
  insertChar: (...args) => insertChar(...args),
  splitLine: (...args) => splitLine(...args),
  handleInsertTextOp: (...args) => handleInsertTextOp(...args),
  handleRemoveTextOp: (...args) => handleRemoveTextOp(...args),
  handleRemoveNodeOp: (...args) => handleRemoveNodeOp(...args),
  handleMergeNodeOp: (...args) => handleMergeNodeOp(...args),
  handleSplitNodeOp: (...args) => handleSplitNodeOp(...args),
  findCharToLeft: (...args) => findCharToLeft(...args),
  findCharToRight: (...args) => findCharToRight(...args),
  setVersionVector: (...args) => setVersionVector(...args),
  incrementVersionVector: (...args) => incrementVersionVector(...args),
  addToDeletionBuffer: (...args) => addToDeletionBuffer(...args),
  removeFromDeletionBuffer: (...args) => removeFromDeletionBuffer(...args),
  processDeletionBuffer: (...args) => processDeletionBuffer(...args),
};
