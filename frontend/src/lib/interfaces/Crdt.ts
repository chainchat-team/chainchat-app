import { BaseOperation, Editor, Point, SplitNodeOperation } from "slate";
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
}

export const CrdtInterface: CrdtInterface = {
    generateChar: (...args) => generateChar(...args),
    retrieveStrategy: (...args) => retrieveStrategy(...args),
    handleLocalInsert: (...args) => handleLocalInsert(...args),
    handleLocalDelete: (...args) => handleLocalDelete(...args),
    handleLocalPaste: (...args) => handleLocalPaste(...args),
    handleRemoteInsert: (...args) => handleRemoteInsert(...args),
    handleRemoteDelete: (...args) => handleRemoteDelete(...args),
    findCharToLeft: (...args) => findCharToLeft(...args),
    findCharToRight: (...args) => findCharToRight(...args)

}
