import { Crdt } from "../interfaces/Crdt";
import { BroadcastCrdtEvent } from "../types/BroadcastEventTypes";

export function addToDeletionBuffer(crdt: Crdt, operation: BroadcastCrdtEvent) {
    if (operation.type !== 'delete') {
        throw new Error(`Failed to add operation of type ${operation.type} to deletion buffer.`)
    }
    crdt.deletionBuffer = [...crdt.deletionBuffer, operation]
}