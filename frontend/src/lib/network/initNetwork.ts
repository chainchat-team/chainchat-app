import { Network } from "../interfaces/Network";
import { Peer } from "../types/Peer";

export function initNetwork(network: Network, otherNetwork: Network) {
    const currentNetwork = new Set(network.globalPeers.map((peer => peer.peerId)))
    const filteredPeers = otherNetwork.globalPeers.filter(peer => {
        return !currentNetwork.has(peer.peerId)
    })
    network.globalPeers = [...network.globalPeers, ...filteredPeers]
}