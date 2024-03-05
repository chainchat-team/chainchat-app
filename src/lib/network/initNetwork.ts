import { Network } from "../interfaces/Network";
import { Version } from "../interfaces/Version";
import { VersionVectorInterface } from "../interfaces/VersionVector";

export function initNetwork(network: Network, otherNetwork: Network) {
    const currentNetwork = new Set(network.globalPeers.map((peer => peer.peerId)))
    const filteredPeers = otherNetwork.globalPeers.filter(peer => {
        return !currentNetwork.has(peer.peerId)
    })
    network.globalPeers = [...network.globalPeers, ...filteredPeers]

    filteredPeers.forEach(peer => {
        network.peerConnectionsCount[peer.peerId] = otherNetwork.peerConnectionsCount[peer.peerId]
    })

    // network.versionVector?.versions = otherNetwork.versionVector
    const versions = otherNetwork.versionVector?.versions?.map(ver => {
        let version: Version = { peer: ver.peer, counter: ver.counter, exceptions: [] }
        ver.exceptions?.forEach(ex => version.exceptions?.push(ex))
        return version
    })

    versions?.forEach(version => {
        if (network.versionVector === null) throw new Error('Network versionVector is null.')
        network.versionVector = VersionVectorInterface.update(network.versionVector, version)
    })
}