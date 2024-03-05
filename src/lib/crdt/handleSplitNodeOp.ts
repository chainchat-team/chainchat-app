
import { BaseOperation, Editor, Text } from "slate";
import { Crdt, CrdtInterface } from "../interfaces/Crdt";
import { Char } from "../interfaces/Char";
import { SplitNodeOperation } from "../types/SplitNodeOperation";
export function handleSplitNodeOp(crtd: Crdt, editor: Editor, operations: SplitNodeOperation[]): Char[] {
    if (operations[0].type !== 'split_node') {
        throw new Error(`Invalid operation type ${operations[0].type} for handleSplitNodeOp.`)
    }
    if (operations.length > 1) {
        throw new Error('Recieved more than 1 insert_text operation.')

    }

    // if it is not a split_node of leaf node, don't do any thing
    const [node, nodePath] = Editor.node(editor, operations[0].path)
    if (!Text.isText(node)) {
        return []
    }

    CrdtInterface.splitLine(editor, operations as SplitNodeOperation[])

    const operation = operations[0]
    const operationPoint = { path: operation.path, offset: operation.position }
    const text = '\n'

    //TODO: vector increment

    //Create new char given left and right char[DONE]
    // first time around, the is no cha
    var char: Char;
    if (!operation.isRemoteOperation) {
        const leftChar = CrdtInterface.findCharToLeft(crtd, editor, operationPoint);
        const rightChar = CrdtInterface.findCharToRight(crtd, editor, operationPoint);
        // start of document: if the leftChar doesn't exist then...?
        // we we need the leftChar because of the we need it's identifer. In this case identifier will be empty
        // also the generation of id maybe wrong because...the 2 default nodes are not consider
        char = CrdtInterface.generateChar(crtd, leftChar as Char, rightChar, text)
    } else {
        if (!operation.char) {
            throw new Error(`Expecting char sent from peer in operation but value of char is${operation.char}`)
        }
        char = operation.char
    }
    //insert new char in the correct position
    CrdtInterface.insertChar(editor, char, operationPoint)

    return [char]

}