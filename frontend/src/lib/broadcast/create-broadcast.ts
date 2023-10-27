import Peer from "peerjs"
import { Broadcast, BroadcastInterface } from "../interfaces/Broadcast"
import { eventBus } from "../events/create-eventbus"
import { BasePeerEvent } from "../types/PeerEventTypes"

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
        eventBus.on('addToNetwork', ({ peerToBeAdded, peerSender }) => {
            const payload: BasePeerEvent = {
                type: 'addToNetwork',
                siteId: peerToBeAdded.siteId,
                peerId: peerToBeAdded.peerId
            }
            broadcast.outgoingConnections.forEach(conn => {
                if (conn.peer !== peerToBeAdded.peerId && conn.peer !== peerSender.peerId) {
                    conn.send(payload)
                }
            })
            broadcast.incomingConnections.forEach(conn => {
                if (conn.peer !== peerToBeAdded.peerId && conn.peer !== peerSender.peerId) {
                    conn.send(payload)
                }
            })
        })
        eventBus.on('removeFromNetworkResponse', peer => {
            if (!!peer) {
                const payload: BasePeerEvent = {
                    type: 'removeFromNetwork',
                    siteId: peer.siteId,
                    peerId: peer.peerId
                }
                broadcast.outgoingConnections.forEach(conn => {
                    if (conn.peer !== peer.peerId) {
                        conn.send(payload)
                    }
                })
                broadcast.incomingConnections.forEach(conn => {
                    if (conn.peer !== peer.peerId) {
                        conn.send(payload)
                    }
                })
            }
        })
        const payload = {
            peerToBeAdded: { peerId: id, siteId: siteId },
            peerSender: { peerId: id, siteId: siteId }
        }
        eventBus.emit('addToNetwork', payload)

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