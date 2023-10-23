import { insertChar } from "./crdt/insertChar";
import { splitLine } from "./crdt/splitLine";
import { eventBus } from "./events/create-eventbus";
import { Crdt } from "./interfaces/Crdt";

export const createCrdt = (): Crdt => {
    const crdt: Crdt = {
        base: 32,
        boundary: 10,
        siteId: 1,
        strategyCache: [],
        peerId: null,
        insertChar: (...args) => insertChar(...args),
        splitLine: (...args) => splitLine(...args)
    }
    eventBus.on('peerId', val => {
        crdt.peerId = val;
    })
    return crdt
}

