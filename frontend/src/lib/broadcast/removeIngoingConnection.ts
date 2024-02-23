import { Broadcast } from "../interfaces/Broadcast";
import { Peer } from "../types/Peer";

export function removeIncomingConnection(broadcast: Broadcast, peer: Peer) {
  broadcast.incomingConnections = broadcast.incomingConnections.filter((item) => item.peerId !== peer.peerId);
}
