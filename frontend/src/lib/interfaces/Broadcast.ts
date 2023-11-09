import { Peer as PeerJs, DataConnection } from "peerjs"
import { addOutGoingConnection } from "../broadcast/addOutGoingConnection"
import { addIncomingConnection } from "../broadcast/addIncomingConnection"
import { BaseOperation, Operation } from "slate"
import { processOutgoingBuffer } from "../broadcast/processOutgoingBuffer"
import { handleIncomingConnection } from "../broadcast/connection/handleIncomingConnection"
import { handleOutgoingConnection } from "../broadcast/connection/handleOutgoingConnection"
import { sendOperation } from "../broadcast/sendOperation"
import { BroadcastOperation } from "../../types/BroadcastOperation"
import { BroadcastCrdtEvent } from "../types/BroadcastEventTypes"
import { PeerCrdtEvent } from "../types/PeerEventTypes"
import { removeOutgoingConnection } from "../broadcast/removeOutgoingConnection"
import { Peer } from "../types/Peer"
import { getIncomingPeer } from "../broadcast/getIncomingPeer"
import { getOutgoingPeer } from "../broadcast/getOutgoingPeer"
import { closeDeadPeers } from "../broadcast/closeDeadPeer"
import { close } from "../broadcast/close"
import { findNewTarget } from "../broadcast/findNewTarget"

export interface Broadcast {
    peer: PeerJs,
    outgoingBuffer: Operation[]
    outgoingConnections: Peer[]
    incomingConnections: Peer[]
    max_buffer_size: number
    siteId: string
    _isCloser: boolean
    targetPeerId: string

}

export interface BroadcastInterface {
    // bindServerEvents: (boardcast: Broadcast, targetPeerId: number) => void;
    addOutGoingConnection: (broadcast: Broadcast, peer: Peer) => void;
    addIncomingConnection: (broadcast: Broadcast, peer: Peer) => void;
    removeOutgoingConnection: (broadcast: Broadcast, peer: Peer) => void
    removeIngoingConnection: (broadcast: Broadcast, peer: Peer) => void
    getIncomingPeer: (broadcast: Broadcast, connection: DataConnection) => Peer
    getOutgoingPeer: (broadcast: Broadcast, connection: DataConnection) => Peer
    // processOutgoingBuffer: (broadcast: Broadcast, connection: DataConnection) => void;
    // acceptConnRequest: (broadcast: Broadcast, peerId: string, siteId: string) => void;
    handleIncomingConnection: (broadcast: Broadcast, peer: PeerJs) => void;
    handleOutgoingConnection: (broadcast: Broadcast, peer: PeerJs, targetPeerId: string) => void;
    findNewTarget: (broadcast: Broadcast) => void
    sendOperation: (broadcast: Broadcast, operations: PeerCrdtEvent) => void;
    closeDeadPeers: (broadcast: Broadcast) => void
    close: (broadcast: Broadcast) => void

}

export const BroadcastInterface: BroadcastInterface = {
    addOutGoingConnection: (...args) => addOutGoingConnection(...args),
    addIncomingConnection: (...args) => addIncomingConnection(...args),
    removeOutgoingConnection: (...args) => removeOutgoingConnection(...args),
    removeIngoingConnection: (...args) => removeOutgoingConnection(...args),
    getIncomingPeer: (...args) => getIncomingPeer(...args),
    getOutgoingPeer: (...args) => getOutgoingPeer(...args),
    // processOutgoingBuffer: (...args) => processOutgoingBuffer(...args),
    handleIncomingConnection: (...args) => handleIncomingConnection(...args),
    handleOutgoingConnection: (...args) => handleOutgoingConnection(...args),
    findNewTarget: (...args) => findNewTarget(...args),
    sendOperation: (...args) => sendOperation(...args),
    closeDeadPeers: (...args) => closeDeadPeers(...args),
    close: (...args) => close(...args)
}
