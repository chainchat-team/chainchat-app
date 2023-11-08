import { Crdt } from "../interfaces/Crdt";
import { BroadcastCrdtEvent } from "../types/BroadcastEventTypes";

export function removeFromDeletionBuffer(crdt: Crdt, operation: BroadcastCrdtEvent): BroadcastCrdtEvent | null {
    const localOp = crdt.deletionBuffer.find(item => (
        item.type === 'delete' &&
        item.siteId === operation.siteId &&
        item.version.counter === operation.version.counter &&
        item.version.peer.siteId === operation.version.peer.siteId)
    )
    if (localOp === undefined) {
        return null
    }
    const idx = crdt.deletionBuffer.indexOf(localOp)
    if (idx === undefined) {
        return null
    }
    crdt.deletionBuffer = [
        ...crdt.deletionBuffer.slice(idx),
        ...crdt.deletionBuffer.slice(idx + 1),
    ]
    return localOp
}