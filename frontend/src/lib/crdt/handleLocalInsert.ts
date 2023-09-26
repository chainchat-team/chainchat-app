import { Editor, InsertTextOperation, Point } from "slate"
import { Crdt, CrdtInterface } from "../interfaces/Crdt";
import { Char } from "../interfaces/Char";
export function handleLocalInsert(crtd: Crdt, editor: Editor, operation: InsertTextOperation): void {
    // {type: 'insert_text', path: [0,0], offset: 31, text: 'a'}
    const operataionPoint: Point = { path: operation.path, offset: operation.offset }

    //TODO: vector increment

    //Create new char given left and right char[DONE]
    // first time around, the is no cha
    const leftChar = CrdtInterface.findCharToLeft(crtd, editor, operataionPoint);
    const rightChar = CrdtInterface.findCharToRight(crtd, editor, operataionPoint);
    // start of document: if the leftChar doesn't exist then...?
    // we we need the leftChar because of the we need it's identifer. In this case identifier will be empty
    // also the generation of id maybe wrong because...the 2 default nodes are not consider
    const char: Char = CrdtInterface.generateChar(crtd, leftChar as Char, rightChar, operation.text)

    //insert new char in the correct position
    crtd.insertChar(editor, char, operataionPoint)
    //TODO:boardcast
}

