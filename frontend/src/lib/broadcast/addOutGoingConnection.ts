import { DataConnection } from "peerjs";
import { Broadcast } from "../interfaces/Broadcast";

export function addOutGoingConnection(broadcast: Broadcast, connection: DataConnection): Broadcast {
    return {
        ...broadcast,
        outgoingConnections: [...broadcast.outgoingConnections, connection]
    }
}