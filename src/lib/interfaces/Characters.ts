import { Char, CharInterface } from "./Char"
export interface Characters {
    characters: Char[];
}


export interface CharactersInterface {
    compareTo: (val: Characters, other: Characters) => number;
}

export const CharactersInterface: CharactersInterface = {
    compareTo: (val: Characters, other: Characters): number => {
        // Compare the identifiers at each level of the positions
        const chars1 = val.characters;
        const chars2 = other.characters;
        for (let i = 0; i < Math.min(chars1.length, chars2.length); i++) {
            const comp = CharInterface.compareTo(chars1[i], chars2[i]);
            // If they are not equal, return the comparison result
            if (comp !== 0) {
                return comp;
            }
        }

        // If all identifiers have been compared and are equal, compare the lengths of pos1 and pos2
        return chars1.length - chars2.length;
    }
}
