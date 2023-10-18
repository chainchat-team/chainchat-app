import { BaseElement, Editor as SlateEditor, Path } from "slate";
import { Char, CharInterface } from "../interfaces/Char";
import { Editor } from "../interfaces/Editor";

/**
 * Finds the Path to the leaf node within a Slate Editor to which a given character belongs.
 * If the character doesn't already exist in the editor, this function identifies the appropriate location to insert it.
 * @param char - The character to locate within the editor.
 * @param editor - The Slate Editor instance.
 * @returns The Path to the leaf node where the character belongs o should be inserted.
 */
export function findEditorPath(char: Char, editor: SlateEditor): Path {
    // the goal of this function is to return the Path to the leaf node to which char belong
    // handle base cases
    // if editor is empty

    if (editor.children.length === 1 && Editor.isEmpty(editor, editor.children[0] as BaseElement)) {
        console.log('editor is empty...')
        return [0, 0]
    }

    //if char is less than the first char in the first child
    const [firstLineLeaf, firstLineLeafPath] = Editor.first(editor, []) as any
    if (CharInterface.compareTo(char, firstLineLeaf.characters[0]) <= 0) {
        console.log('char is smaller than first char in the first line...so returing first line')
        return firstLineLeafPath
    }


    //if char is greater than the last char in the editor, pick between last line vs next of last line
    const [lastLineLeaf, lastLineLeafPath] = Editor.lastValidLeaf(editor)
    const lastLineLength = (lastLineLeaf as any).characters.length;
    const lastLineChar = (lastLineLeaf as any).characters[lastLineLength - 1];
    if (CharInterface.compareTo(char, lastLineChar) > 0) {
        if (lastLineChar.value === "\n") {
            const newLineLeafPath = [...lastLineLeafPath]
            newLineLeafPath[0]++;
            console.log('the value is greater than last line char...and belongs in a new line')
            return newLineLeafPath
        }
        console.log('the value is greater than last line char...but still belong in the same line')
        return lastLineLeafPath
    }

    //assume that there will be no subpragraph
    // find the best child of the root 
    // the goal of finding line means creating path property for Point
    let top = firstLineLeafPath[0]
    let bottom = lastLineLeafPath[0]
    let mid: number = -1;
    while (1 < bottom - top) {
        mid = Math.floor(top + (bottom - top) / 2)
        // get the mid child
        // currentLine = editor.children[mid] as any
        let [currentLeaf, currentLeafPath] = Editor.last(editor, [mid])

        let currentLeafLength = (currentLeaf as any).characters.length
        let lastChar: Char = (currentLeaf as any).characters[currentLeafLength - 1]

        if (CharInterface.compareTo(char, lastChar) === 0) {
            return currentLeafPath
        } else if (CharInterface.compareTo(char, lastChar) < 0) {
            bottom = currentLeafPath[0];
        } else {
            top = currentLeafPath[0];
        }
    }
    // we have to pick between top or bottom
    const [topLeaf, topLeafPath] = Editor.last(editor, [top])
    const topLeafPathLength = (topLeaf as any).characters.length;
    const topLeafLastChar = (topLeaf as any).characters[topLeafPathLength - 1]
    console.log('---topleaf----')
    console.log(topLeaf)
    console.log(topLeafLastChar)
    console.log(CharInterface.compareTo(char, topLeafLastChar))
    console.log('---topleaf----')
    if (CharInterface.compareTo(char, topLeafLastChar) <= 0) {
        console.log('returning top!!')
        return topLeafPath
    } else {
        let [_, bottomLeafPath] = Editor.last(editor, [bottom])
        console.log('returning bottom!!')
        return bottomLeafPath
    }

}