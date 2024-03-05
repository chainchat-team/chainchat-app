import { Broadcast } from "../interfaces/Broadcast";
import { Peer } from "../types/Peer";

export function addOutGoingConnection(broadcast: Broadcast, peer: Peer): void {
  broadcast.outgoingConnections = [...broadcast.outgoingConnections, peer];
}
