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
export interface Crdt {
    // Core state
    base: number
    boundary: number
    siteId: number
    strategyCache: boolean[]
    peerId: string | null
    //methods
    insertChar: (editor: Editor, char: Char, point: Point) => void;
    splitLine: (editor: Editor, operations: SplitNodeOperation[]) => void
}

export interface CrdtInterface {
    retrieveStrategy: (crdt: Crdt, depth: number) => boolean;
    generateChar: (crdt: Crdt, char1: Char, char2: Char, value: string) => Char
    handleLocalInsert: (crtd: Crdt, editor: Editor, operation: BaseOperation[]) => Char[]
    handleLocalDelete: (crtd: Crdt, editor: Editor, operation: BaseOperation[]) => Char[]
    handleLocalPaste: (crtd: Crdt, editor: Editor, event: React.ClipboardEvent) => void
    handleRemoteInsert: (crtd: Crdt, editor: Editor, char: Char) => void
    handleRemoteDelete: (crtd: Crdt, editor: Editor, char: Char) => void
    findCharToLeft: (crdt: Crdt, editor: Editor, point: Point) => Char | undefined;
    findCharToRight: (crdt: Crdt, editor: Editor, point: Point) => Char;

    /*--*/
    handleInsertTextOp: (crtd: Crdt, editor: Editor, operation: InsertTextOperation[]) => Char[]
    handleSplitNodeOp: (crtd: Crdt, editor: Editor, operation: SplitNodeOperation[]) => Char[]
    handleRemoveTextOp: (crtd: Crdt, editor: Editor, operation: RemoveTextOperation[]) => Char[]
    handleRemoveNodeOp: (crtd: Crdt, editor: Editor, operation: RemoveNodeOperation[]) => Char[]
    handleMergeNodeOp: (crtd: Crdt, editor: Editor, operation: MergeNodeOperation[]) => Char[]
}

export const CrdtInterface: CrdtInterface = {
    generateChar: (...args) => generateChar(...args),
    retrieveStrategy: (...args) => retrieveStrategy(...args),
    handleLocalInsert: (...args) => handleLocalInsert(...args),
    handleLocalDelete: (...args) => handleLocalDelete(...args),
    handleLocalPaste: (...args) => handleLocalPaste(...args),
    handleRemoteInsert: (...args) => handleRemoteInsert(...args),
    handleRemoteDelete: (...args) => handleRemoteDelete(...args),
    handleInsertTextOp: (...args) => handleInsertTextOp(...args),
    handleRemoveTextOp: (...args) => handleRemoveTextOp(...args),
    handleRemoveNodeOp: (...args) => handleRemoveNodeOp(...args),
    handleMergeNodeOp: (...args) => handleMergeNodeOp(...args),
    handleSplitNodeOp: (...args) => handleSplitNodeOp(...args),
    findCharToLeft: (...args) => findCharToLeft(...args),
    findCharToRight: (...args) => findCharToRight(...args)

}
