import { insertChar } from "./crdt/insertChar";
import { splitLine } from "./crdt/splitLine";
import { eventBus } from "./events/create-eventbus";
import { Crdt } from "./interfaces/Crdt";

export const createCrdt = (siteId: string): Crdt => {
    const crdt: Crdt = {
        base: 32,
        boundary: 10,
        siteId: siteId,
        strategyCache: [],
        peerId: null,
        versionVector: {
            versions: [{ siteId: siteId, counter: 0, exceptions: [] }],
            localVersion: { siteId: siteId, counter: 0, exceptions: [] }
        },
        insertChar: (...args) => insertChar(...args),
        splitLine: (...args) => splitLine(...args)
    }
    eventBus.on('peerId', val => {
        crdt.peerId = val;
    })
    return crdt
}

