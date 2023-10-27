import { Network } from "../interfaces/Network";
import { Peer } from "../types/Peer";

export function removeFromNetwork(network: Network, partialPeer: Partial<Peer>): Peer | null {
    const peer = network.globalPeers.find(item => item.peerId === partialPeer.peerId)
    if (peer === undefined) {
        return null
    }
    const index = network.globalPeers.indexOf(peer)
    if (index < 0) {
        return null
    }
    network.globalPeers = [
        ...network.globalPeers.slice(0, index),
        ...network.globalPeers.slice(index)
    ]
    return peer
}