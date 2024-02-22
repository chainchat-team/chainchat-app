import { version } from "react";
import { insertChar } from "./crdt/insertChar";
import { splitLine } from "./crdt/splitLine";
import { eventBus } from "./events/create-eventbus";
import { Crdt, CrdtInterface } from "./interfaces/Crdt";
import { Version } from "./interfaces/Version";
import { BroadcastSyncRequestEvent } from "./types/BroadcastEventTypes";
import { VersionVectorInterface } from "./interfaces/VersionVector";
import PeerId from "../components/PeerId";
import { Peer } from "./types/Peer";
import { Peer as PeerJs } from 'peerjs';

export const createCrdt = (peerjs: PeerJs, siteId: string): Crdt => {
    const crdt: Crdt = {
        base: 32,
        boundary: 10,
        siteId: siteId,
        strategyCache: [],
        peerId: null,
        versionVector: null,
        deletionBuffer: [],
    }
    peerjs.on('open', (id: string) => {
        crdt.peerId = id
        const peer: Peer = { siteId: siteId, peerId: id }
        crdt.versionVector = {
            versions: [{ peer: peer, counter: 0, exceptions: [] }],
            localVersion: { peer: peer, counter: 0, exceptions: [] }
        }
        eventBus.on('requestCrdt', () => {
            eventBus.emit('responseCrdt', { ...crdt })
        })
        eventBus.on('requestVersionVector', () => {
            if (crdt.versionVector === null) throw new Error('Crdt versionVector is null.')
            eventBus.emit('responseVersionVector', { versions: crdt.versionVector.versions })
        })
        eventBus.on('handleSyncRequest', (payload: BroadcastSyncRequestEvent) => {
            const versions = payload.versionVector.versions?.map(ver => {
                let version: Version = { peer: ver.peer, counter: ver.counter, exceptions: [] }
                ver.exceptions?.forEach(ex => version.exceptions?.push(ex))
                return version
            })

            versions?.forEach(version => {
                if (crdt.versionVector === null) throw new Error('Crdt versionVector is null.')
                const versionVec = VersionVectorInterface.update(crdt.versionVector, version)
                CrdtInterface.setVersionVector(crdt, versionVec)
            })
        })
    })
    return crdt
}

