import { Broadcast } from "../interfaces/Broadcast";
import { BroadcastOperation } from "../../types/BroadcastOperation";

export function sendOperation(broadcast: Broadcast, operation: BroadcastOperation): void {
    broadcast.outgoingConnections.forEach(conn => {
        conn.send(operation)
    })
}