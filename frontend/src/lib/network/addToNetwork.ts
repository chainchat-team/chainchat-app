import { Network } from "../interfaces/Network";
import { Peer } from "../types/Peer";

export function addToNetwork(network: Network, peer: Peer): Peer | null {
    const isInNetwork = !!network.globalPeers.find(item => item.siteId === peer.siteId)
    if (!isInNetwork) {
        network.globalPeers = [...network.globalPeers, peer]
        return peer
    }
    return null
}