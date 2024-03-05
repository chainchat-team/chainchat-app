import { Char, CharInterface } from "../interfaces/Char";

/**
 * 
 * @param char 
 * @param characters 
 * @returns 
 */
export function findInsertIndex(char: Char, characters: Char[]): number {
    let left = 0
    let right = characters.length - 1

    // handle base cases 
    if (characters.length === 0) {
        return left
    }
    if (CharInterface.compareTo(char, characters[0]) < 0) {
        return left
    }
    if (CharInterface.compareTo(char, characters[right]) > 0) {
        return right + 1
    }

    // perfrom binary search
    while (1 < right - left) {
        let mid = Math.floor(left + (right - left) / 2)
        let comparison = CharInterface.compareTo(char, characters[mid])
        if (comparison === 0) {
            return mid
        } else if (comparison > 0) {
            left = mid
        } else {
            right = mid
        }
    }

    if (CharInterface.compareTo(char, characters[left]) === 0) {
        return left
    } else {
        return right
    }
}