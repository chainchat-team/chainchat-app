import { AvatarMapInterface } from "../interfaces/AvatarMapInterface";
import { Network } from "../interfaces/Network";
import { Peer } from "../types/Peer";

export function addToNetwork(network: Network, peer: Peer): Peer | null {
  const isInNetwork = !!network.globalPeers.find((item) => item.siteId === peer.siteId);
  if (!isInNetwork) {
    peer.avatar = peer.avatar ? peer.avatar : AvatarMapInterface.peerIdToAvatar(peer.peerId);
    network.globalPeers = [...network.globalPeers, peer];
    return peer;
  }
  return null;
}
