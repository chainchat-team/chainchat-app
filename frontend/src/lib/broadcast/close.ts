import { Broadcast } from "../interfaces/Broadcast";

export function close(broadcast: Broadcast) {
    broadcast.incomingConnections.forEach(peer => peer.connection?.close())
    broadcast.outgoingConnections.forEach(peer => peer.connection?.close())
}