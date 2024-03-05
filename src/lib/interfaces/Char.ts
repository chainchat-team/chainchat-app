import { Editor, Path } from "slate";
import { Identifier, IdentifierInterface } from "./Identifier";
import { findEditorPath } from "../char/findEditorPath";
import { findInsertIndex } from "../char/findInsertIndex";

export interface Char {
    identifiers: Identifier[];
    value: string;
    counter: number;
    siteId: string;
    peerId: string;
}

export interface CharInterface {
    compareTo: (char: Char, otherChar: Char) => number;
    findEditorPath: (char: Char, editor: Editor) => Path;
    findInsertIndex: (char: Char, characters: Char[]) => number;
}

// Implement the CharInterface
export const CharInterface: CharInterface = {
    compareTo: function (char: Char, otherChar: Char): number {
        // Get the positions for this character and the other character
        const pos1 = char.identifiers;
        const pos2 = otherChar.identifiers;

        // Compare the identifiers at each level of the positions
        for (let i = 0; i < Math.min(pos1.length, pos2.length); i++) {
            const comp = IdentifierInterface.compareTo(pos1[i], pos2[i]);
            // If they are not equal, return the comparison result
            if (comp !== 0) {
                return comp;
            }
        }

        // If all identifiers have been compared and are equal, compare the lengths of pos1 and pos2
        return pos1.length - pos2.length;
    },
    findEditorPath: (...args) => findEditorPath(...args),
    findInsertIndex: (...args) => findInsertIndex(...args)
};
