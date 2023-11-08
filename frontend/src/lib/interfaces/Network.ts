import { addToNetwork } from "../network/addToNetwork";
import { incrementVersionVector } from "../network/incrementVersionVector";
import { initNetwork } from "../network/initNetwork";
import { removeFromNetwork } from "../network/removeFromNetwork";
import { Peer } from "../types/Peer";
import { VersionVector } from "./VersionVector";

export interface Network {
    // will store peer's in the whole network
    globalPeers: Peer[]
    // will store peer that a peer is connected to?
    // localPeers: Peer[]
    versionVector: VersionVector | null
    // peerConnectionsCount: { [peerId: string]: number }
    peerConnectionsCount: { [key: string]: number }

}

export interface NetworkInterface {
    addToNetwork: (network: Network, peer: Peer) => Peer | null
    removeFromNetwork: (network: Network, peer: Partial<Peer>) => Peer | null
    initNetwork: (network: Network, otherNetwork: Network) => void
    incrementVersionVector: (network: Network) => void

}

export const NetworkInterface: NetworkInterface = {
    addToNetwork: (...args) => addToNetwork(...args),
    removeFromNetwork: (...args) => removeFromNetwork(...args),
    initNetwork: (...args) => initNetwork(...args),
    incrementVersionVector: (...args) => incrementVersionVector(...args)
}
