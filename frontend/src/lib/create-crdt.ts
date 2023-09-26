import { insertChar } from "./crdt/insertChar";
import { Crdt } from "./interfaces/Crdt";

export const createCrdt = (): Crdt => {
    const crdt: Crdt = {
        base: 32,
        boundary: 10,
        siteId: 1,
        strategyCache: [],
        insertChar: (...args) => insertChar(...args)
    }
    return crdt
}

