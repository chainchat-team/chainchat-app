import { DataConnection } from "peerjs";
import { Broadcast } from "../interfaces/Broadcast";
import { Peer } from "../types/Peer";

export function getOutgoingPeer(broadcast: Broadcast, connection: DataConnection): Peer {
    const peer = broadcast.outgoingConnections.find(peer => peer.peerId === connection.peer)
    if (peer === undefined) {
        throw new Error(`Broadcast outgoing connection does not contain connection ${connection.peer}`)
    }
    return peer
}