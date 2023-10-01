import { Char } from "../interfaces/Char";
import { Crdt, CrdtInterface } from "../interfaces/Crdt";
import { Identifier } from "../interfaces/Identifier";

export function generateChar(crtd: Crdt, char1: Char, char2: Char, value: string): Char {
    // generate a new identifier given identifiers
    let depth: number = 0
    let interval: number = 0
    const path1 = char1.identifiers;
    const path2 = char2.identifiers;


    let val1 = 0;
    let val2 = crtd.base;
    while (interval < 1) {
        val1 = path1[depth] !== undefined ? path1[depth].digit : 0;
        val2 = path2[depth] !== undefined ? path2[depth].digit : crtd.base;
        interval = Math.max(val2, val1) - Math.min(val2, val1) - 1
        depth++;
    }
    depth -= 1;

    const step = Math.min(crtd.boundary, interval)

    const strategy = CrdtInterface.retrieveStrategy(crtd, depth)
    console.log('---iterval---')
    console.log(interval)
    console.log('---iterval---')
    let digit;
    if (strategy) {
        // 0,.....,step-1
        // 1,.....,step
        const addValue = Math.floor(Math.random() * (step - 0)) + 1
        digit = val1 + addValue;
    } else {
        const subValue = Math.floor(Math.random() * (step - 0)) + 1
        digit = val2 - subValue;
    }

    const parentDepth: number = strategy ? Math.min(path1.length - 1, depth - 1) : Math.min(path2.length - 1, depth - 1);
    const identifiers: Identifier[] = strategy ? path1.slice(0, parentDepth + 1) : path2.slice(0, parentDepth + 1)
    const identifier: Identifier = { digit: digit, siteId: crtd.siteId }
    identifiers.push(identifier)

    //NOTE: Counter is not implemented for now, but filled with placeholder
    const newChar: Char = {
        identifiers: identifiers,
        value: value,
        counter: 1,
        siteId: crtd.siteId
    }
    return newChar
}