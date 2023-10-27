import { Network } from "../interfaces/Network";
import { Peer } from "../types/Peer";

export function initNetwork(network: Network, otherNetwork: Network) {
    network.globalPeers = [...network.globalPeers, ...otherNetwork.globalPeers]
}