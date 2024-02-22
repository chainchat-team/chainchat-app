import { fetchNetwork } from "../events/fetchNetwork";
import { Broadcast, BroadcastInterface } from "../interfaces/Broadcast";
import { Peer } from "../types/Peer";

export async function getAvailablePeer(broadcast: Broadcast): Promise<Peer | undefined> {
    const network = await fetchNetwork()
    const threshold = await BroadcastInterface.getConnectionThreshold(broadcast)
    console.log(network)
    const possiblePeers: Peer[] = []
    for (const peer of network.globalPeers) {
        const peerIncommingConnectionSize = network.peerConnectionsCount[peer.peerId] || 0
        const hasReachedMax = peerIncommingConnectionSize > threshold
        if (!hasReachedMax && peer.peerId !== broadcast.peer.id) {
            possiblePeers.push(peer)
        }
    }

    if (possiblePeers.length < 1) {
        return undefined
    }

    const randomIdx = Math.floor(Math.random() * possiblePeers.length)
    return possiblePeers[randomIdx]
}