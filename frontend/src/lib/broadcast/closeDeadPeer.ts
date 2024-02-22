import { Broadcast } from "../interfaces/Broadcast";
import { Peer } from "../types/Peer";

export function closeDeadPeers(broadcast: Broadcast) {
    const isPeerAlive = (peer: Peer) => {
        if (peer.connection === undefined) {
            return true
        }
        return !['closed', 'disconnected', 'falied'].includes(peer.connection.peerConnection.iceConnectionState)
    }

    broadcast.incomingConnections.forEach(peer => isPeerAlive(peer) || peer.connection?.close())
    broadcast.outgoingConnections.forEach(peer => isPeerAlive(peer) || peer.connection?.close())

}