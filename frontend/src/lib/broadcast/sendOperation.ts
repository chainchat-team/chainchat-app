import { Broadcast } from "../interfaces/Broadcast";
import { BroadcastOperation } from "../../types/BroadcastOperation";
import { PeerCrdtEvent } from "../types/PeerEventTypes";

export function sendOperation(broadcast: Broadcast, operation: PeerCrdtEvent): void {
    broadcast.outgoingConnections.forEach(conn => {
        conn.send(operation)
    })
}