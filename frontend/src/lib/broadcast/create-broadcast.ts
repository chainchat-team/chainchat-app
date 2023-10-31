import Peer from "peerjs"
import { Broadcast, BroadcastInterface } from "../interfaces/Broadcast"
import { eventBus } from "../events/create-eventbus"
import { BasePeerEvent, PeerAddToNetworkEvent, PeerCrdtEvent, PeerRemoveFromNetworkEvent } from "../types/PeerEventTypes"
import { BroadcastCrdtEvent } from "../types/BroadcastEventTypes"

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
        _isCloser: false
    }
    peer.on('open', (id: string) => {
        eventBus.emit('peerId', broadcast.peer.id)
        eventBus.on('insert', (data: BroadcastCrdtEvent) => {
            broadcast.outgoingConnections.forEach(peer => peer.connection?.send(data as PeerCrdtEvent))
            broadcast.incomingConnections.forEach(peer => peer.connection?.send(data as PeerCrdtEvent))
        })
        eventBus.on('delete', (data: BroadcastCrdtEvent) => {
            broadcast.outgoingConnections.forEach(peer => peer.connection?.send(data as PeerCrdtEvent))
            broadcast.incomingConnections.forEach(peer => peer.connection?.send(data as PeerCrdtEvent))
        })
        eventBus.on('broadcastAddToNetwork', ({ peerToBeAdded, peerSender }) => {
            // only tell you peers this has been added
            const payload: PeerAddToNetworkEvent = {
                type: 'addToNetwork',
                siteId: peerSender.siteId, // this should be the id of the whoever send the request
                peerId: peerSender.peerId,
                peerToBeAdded: { peerId: peerToBeAdded.peerId, siteId: peerToBeAdded.siteId }
            }
            broadcast.outgoingConnections.forEach(peer => {
                if (![peerToBeAdded.peerId, peerSender.peerId].includes(peer.peerId)) {
                    peer.connection?.send(payload)
                }
            })
            broadcast.incomingConnections.forEach(peer => {
                if (![peerToBeAdded.peerId, peerSender.peerId].includes(peer.peerId)) {
                    peer.connection?.send(payload)
                }
            })
        })
        eventBus.on('broadcastRemoveFromNetwork', ({ peerToBeRemoved, peerSender }) => {
            const payload: PeerRemoveFromNetworkEvent = {
                type: 'removeFromNetwork',
                siteId: peerSender.siteId,
                peerId: peerSender.peerId,
                peerToBeRemoved: { peerId: peerToBeRemoved.peerId, siteId: peerToBeRemoved.siteId }
            }
            BroadcastInterface.removeIngoingConnection(broadcast, peerToBeRemoved)
            BroadcastInterface.removeOutgoingConnection(broadcast, peerToBeRemoved)
            broadcast.outgoingConnections.forEach(peer => {
                if (![peerToBeRemoved.peerId, peerSender.peerId].includes(peer.peerId)) {
                    peer.connection?.send(payload)
                }
            })
            broadcast.incomingConnections.forEach(peer => {
                if (![peerToBeRemoved.peerId, peerSender.peerId].includes(peer.peerId)) {
                    peer.connection?.send(payload)
                }
            })
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

        eventBus.on('requestCurrentTarget', () => {
            if (broadcast.outgoingConnections.length > 1) {
                throw new Error('More than 1 peer found in the brodcast outgoing connection.')
            }
            if (broadcast.outgoingConnections.length === 0) {
                eventBus.emit('responseCurrentTarget', null)
            } else {
                eventBus.emit('responseCurrentTarget', broadcast.outgoingConnections[0])
            }

        })
        // setInterval(() => {
        //     BroadcastInterface.closeDeadPeers(broadcast)
        // }, 5000)

    })
    return broadcast
}