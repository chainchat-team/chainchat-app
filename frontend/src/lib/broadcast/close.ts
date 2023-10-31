import { Broadcast } from "../interfaces/Broadcast";

export function close(broadcast: Broadcast) {
    broadcast._isCloser = true
    broadcast.incomingConnections.forEach(peer => peer.connection?.close())
    broadcast.outgoingConnections.forEach(peer => peer.connection?.close())
}