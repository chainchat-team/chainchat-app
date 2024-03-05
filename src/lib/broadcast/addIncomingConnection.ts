import { Broadcast } from "../interfaces/Broadcast";
import { Peer } from "../types/Peer";

export function addIncomingConnection(broadcast: Broadcast, peer: Peer): void {
  broadcast.incomingConnections = [...broadcast.incomingConnections, peer];
}
