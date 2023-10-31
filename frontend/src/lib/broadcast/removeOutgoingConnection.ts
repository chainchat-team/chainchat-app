import { DataConnection } from "peerjs";
import { Broadcast } from "../interfaces/Broadcast";
import { Peer } from "../types/Peer";

export function removeOutgoingConnection(broadcast: Broadcast, peer: Peer) {
    broadcast.outgoingConnections = broadcast.outgoingConnections.filter(item => item.peerId !== peer.peerId)
}