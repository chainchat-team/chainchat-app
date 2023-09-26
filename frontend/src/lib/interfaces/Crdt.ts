import { Editor, InsertTextOperation, Point } from "slate";
import { Char } from "./Char";
import { generateChar } from "../crdt/generateChar";
import { retrieveStrategy } from "../crdt/retrieveStrategy";
import { handleLocalInsert } from "../crdt/handleLocalInsert";
import { findCharToLeft } from "../crdt/findCharToLeft";
import { findCharToRight } from "../crdt/findCharToRight";
export interface Crdt {
    // Core state
    base: number
    boundary: number
    siteId: number
    strategyCache: boolean[]
    //methods
    insertChar: (editor: Editor, char: Char, point: Point) => void;
}

export interface CrdtInterface {
    retrieveStrategy: (crdt: Crdt, depth: number) => boolean;
    generateChar: (crdt: Crdt, char1: Char, char2: Char, value: string) => Char
    handleLocalInsert: (crtd: Crdt, editor: Editor, operation: InsertTextOperation) => void
    findCharToLeft: (crdt: Crdt, editor: Editor, point: Point) => Char | undefined;
    findCharToRight: (crdt: Crdt, editor: Editor, point: Point) => Char;
}

export const CrdtInterface: CrdtInterface = {
    generateChar: (...args) => generateChar(...args),
    retrieveStrategy: (...args) => retrieveStrategy(...args),
    handleLocalInsert: (...args) => handleLocalInsert(...args),
    findCharToLeft: (...args) => findCharToLeft(...args),
    findCharToRight: (...args) => findCharToRight(...args)

}
