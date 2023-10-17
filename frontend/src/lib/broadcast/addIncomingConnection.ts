import { DataConnection } from "peerjs";
import { Broadcast } from "../interfaces/Broadcast";

export function addIncomingConnection(broadcast: Broadcast, connection: DataConnection): Broadcast {
    return {
        ...broadcast,
        incomingConnections: [...broadcast.incomingConnections, connection]
    }
}