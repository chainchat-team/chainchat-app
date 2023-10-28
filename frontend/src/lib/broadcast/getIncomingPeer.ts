import { DataConnection } from "peerjs";
import { Broadcast } from "../interfaces/Broadcast";
import { Peer } from "../types/Peer";

export function getIncomingPeer(broadcast: Broadcast, connection: DataConnection): Peer {
    const peer = broadcast.incomingConnections.find(peer => peer.peerId === connection.peer)
    if (peer === undefined) {
        throw new Error(`Broadcast incoming connection does not contain connection ${connection.peer}`)
    }
    return peer
}