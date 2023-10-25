import { Peer, DataConnection } from "peerjs"
import { addOutGoingConnection } from "../broadcast/addOutGoingConnection"
import { addIncomingConnection } from "../broadcast/addIncomingConnection"
import { BaseOperation, Operation } from "slate"
import { processOutgoingBuffer } from "../broadcast/processOutgoingBuffer"
import { handleIncomingConnection } from "../broadcast/connection/handleIncomingConnection"
import { handleOutgoingConnection } from "../broadcast/connection/handleOutgoingConnection"
import { sendOperation } from "../broadcast/sendOperation"
import { BroadcastOperation } from "../../types/BroadcastOperation"

export interface Broadcast {
    peer: Peer,
    outgoingBuffer: Operation[]
    outgoingConnections: DataConnection[]
    incomingConnections: DataConnection[]
    max_buffer_size: number
    siteId: string

}

export interface BroadcastInterface {
    // bindServerEvents: (boardcast: Broadcast, targetPeerId: number) => void;
    addOutGoingConnection: (broadcast: Broadcast, connection: DataConnection) => Broadcast;
    addIncomingConnection: (broadcast: Broadcast, connection: DataConnection) => Broadcast;
    // processOutgoingBuffer: (broadcast: Broadcast, connection: DataConnection) => void;
    // acceptConnRequest: (broadcast: Broadcast, peerId: string, siteId: string) => void;
    handleIncomingConnection: (broadcast: Broadcast, peer: Peer) => void;
    handleOutgoingConnection: (broadcast: Broadcast, peer: Peer, targetPeerId: string) => void;
    sendOperation: (broadcast: Broadcast, operations: BroadcastOperation) => void;
}

export const BroadcastInterface: BroadcastInterface = {
    addOutGoingConnection: (...args) => addOutGoingConnection(...args),
    addIncomingConnection: (...args) => addIncomingConnection(...args),
    // processOutgoingBuffer: (...args) => processOutgoingBuffer(...args),
    handleIncomingConnection: (...args) => handleIncomingConnection(...args),
    handleOutgoingConnection: (...args) => handleOutgoingConnection(...args),
    sendOperation: (...args) => sendOperation(...args)

}
