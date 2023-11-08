import { BaseOperation, Editor, Point, SplitNodeOperation } from "slate"
import { Crdt, CrdtInterface } from "../interfaces/Crdt";
import { Char } from "../interfaces/Char";
export function handleLocalInsert(crtd: Crdt, editor: Editor, operations: BaseOperation[]): Char[] {
    var text: string;
    var operationPoint: Point;
    if (operations.length === 0) {
        throw new Error('Operations array is empty.')
    }
    if (operations[0].type === 'split_node') {
        //update the characters array in the 2 new nodes
        CrdtInterface.splitLine(editor, operations as SplitNodeOperation[])
        const operation = operations[0]
        operationPoint = { path: operation.path, offset: operation.position }
        text = '\n'
    } else if (operations[0].type == 'insert_text') {
        // {type: 'insert_text', path: [0,0], offset: 31, text: 'a'}
        const operation = operations[0]
        operationPoint = { path: operation.path, offset: operation.offset }
        text = operation.text
    } else {
        throw new Error('Invalid operation type for handleLocalInsert')
    }

    //TODO: vector increment

    //Create new char given left and right char[DONE]
    // first time around, the is no cha
    const leftChar = CrdtInterface.findCharToLeft(crtd, editor, operationPoint);
    const rightChar = CrdtInterface.findCharToRight(crtd, editor, operationPoint);
    // start of document: if the leftChar doesn't exist then...?
    // we we need the leftChar because of the we need it's identifer. In this case identifier will be empty
    // also the generation of id maybe wrong because...the 2 default nodes are not consider
    const char: Char = CrdtInterface.generateChar(crtd, leftChar as Char, rightChar, text)
    //insert new char in the correct position
    CrdtInterface.insertChar(editor, char, operationPoint)

    return [char]
}

