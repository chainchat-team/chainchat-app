import Peer from "peerjs"
import { Broadcast, BroadcastInterface } from "../interfaces/Broadcast"
import { eventBus } from "../events/create-eventbus"

export const createBroadcast = (
    peer: Peer,
    siteId: string,
    targetPeerId: string
) => {
    const broadcast: Broadcast = {
        peer: peer,
        outgoingBuffer: [],
        outgoingConnections: [],
        incomingConnections: [],
        max_buffer_size: 10,
        siteId: siteId,
    }
    peer.on('open', (id: string) => {
        eventBus.emit('peerId', broadcast.peer.id)
        BroadcastInterface.handleIncomingConnection(broadcast, peer)
        if (targetPeerId !== '0') {
            BroadcastInterface.handleOutgoingConnection(broadcast, peer, targetPeerId)
        }
        eventBus.on('insert', (data) => {
            BroadcastInterface.sendOperation(broadcast, data)
        })
    })
    return broadcast
}