import { DataConnection } from "peerjs";
import { Broadcast } from "../interfaces/Broadcast";

/**
 * Send the operations in the outgoing buffer to a connection
 * @param broadcast 
 * @param connection 
 */
export function processOutgoingBuffer(broadcast: Broadcast, connection: DataConnection): void {
    broadcast.outgoingBuffer.forEach(op => {
        connection.send(op)
    })
}