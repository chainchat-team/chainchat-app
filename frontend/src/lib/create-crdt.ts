import { version } from "react";
import { insertChar } from "./crdt/insertChar";
import { splitLine } from "./crdt/splitLine";
import { eventBus } from "./events/create-eventbus";
import { Crdt, CrdtInterface } from "./interfaces/Crdt";
import { Version } from "./interfaces/Version";
import { BroadcastSyncRequestEvent } from "./types/BroadcastEventTypes";
import { VersionVectorInterface } from "./interfaces/VersionVector";

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
        deletionBuffer: [],
        insertChar: (...args) => insertChar(...args),
        splitLine: (...args) => splitLine(...args)
    }
    eventBus.on('peerId', val => {
        crdt.peerId = val;
    })
    eventBus.on('requestVersionVector', () => {
        eventBus.emit('responseVersionVector', { versions: crdt.versionVector.versions })
    })
    eventBus.on('handleSyncRequest', (payload: BroadcastSyncRequestEvent) => {
        const versions = payload.versionVector.versions?.map(ver => {
            let version: Version = { siteId: ver.siteId, counter: ver.counter, exceptions: [] }
            ver.exceptions?.forEach(ex => version.exceptions?.push(ex))
            return version
        })

        versions?.forEach(version => {
            const versionVec = VersionVectorInterface.update(crdt.versionVector, version)
            CrdtInterface.setVersionVector(crdt, versionVec)
        })
    })
    return crdt
}

