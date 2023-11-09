import { Peer as Peerjs } from "peerjs"
import { Broadcast, BroadcastInterface } from "../interfaces/Broadcast"
import { eventBus } from "../events/create-eventbus"
import { BasePeerEvent, PeerAddToNetworkEvent, PeerCrdtEvent, PeerRemoveFromNetworkEvent } from "../types/PeerEventTypes"
import { BroadcastCrdtEvent } from "../types/BroadcastEventTypes"
import { VersionVector, VersionVectorInterface } from "../interfaces/VersionVector"

export const createBroadcast = (
    peerjs: Peerjs,
    siteId: string,
    targetPeerId: string
) => {
    const broadcast: Broadcast = {
        peer: peerjs,
        outgoingBuffer: [],
        outgoingConnections: [],
        incomingConnections: [],
        max_buffer_size: 10,
        siteId: siteId,
        _isCloser: false,
        targetPeerId: targetPeerId
    }
    peerjs.on('open', (id: string) => {
        eventBus.emit('peerId', broadcast.peer.id)
        eventBus.on('insert', (data: BroadcastCrdtEvent) => {
            broadcast.outgoingConnections.forEach(peer => peer.connection?.send(data as PeerCrdtEvent))
            broadcast.incomingConnections.forEach(peer => peer.connection?.send(data as PeerCrdtEvent))
        })
        eventBus.on('delete', (data: BroadcastCrdtEvent) => {
            broadcast.outgoingConnections.forEach(peer => peer.connection?.send(data as PeerCrdtEvent))
            broadcast.incomingConnections.forEach(peer => peer.connection?.send(data as PeerCrdtEvent))
        })
        eventBus.on('broadcastAddToNetwork', ({ peerToBeAdded, peerSender, networkVersion }) => {
            // only tell you peers this has been added
            const payload: PeerAddToNetworkEvent = {
                type: 'addToNetwork',
                siteId: peerSender.siteId, // this should be the id of the whoever send the request
                peerId: peerSender.peerId,
                peerToBeAdded: { peerId: peerToBeAdded.peerId, siteId: peerToBeAdded.siteId },
                networkVersion: networkVersion
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
        eventBus.on('broadcastRemoveFromNetwork', ({ peerToBeRemoved, peerSender, networkVersion, connectionType }) => {
            const payload: PeerRemoveFromNetworkEvent = {
                type: 'removeFromNetwork',
                siteId: peerSender.siteId,
                peerId: peerSender.peerId,
                peerToBeRemoved: { peerId: peerToBeRemoved.peerId, siteId: peerToBeRemoved.siteId },
                networkVersion: networkVersion,
                connectionType: connectionType
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

        // eventBus.on('responseNetworkVersionVector', (versionVector: VersionVector) => {

        //     const payload = {
        //         peerToBeAdded: { peerId: peerjs.id, siteId: siteId },
        //         peerSender: { peerId: peerjs.id, siteId: siteId },
        //         networkVersion: VersionVectorInterface.getLocalVersion(versionVector)
        //     }
        //     eventBus.emit('addToNetwork', payload)
        // })

        // // this assumes that Network has been initialized....
        // // if the network can add the Peer it self, then we don't need the logic
        // eventBus.emit('requestNetworkVersionVector')

        BroadcastInterface.handleIncomingConnection(broadcast, peerjs)
        if (targetPeerId !== '') {
            BroadcastInterface.handleOutgoingConnection(broadcast, peerjs, targetPeerId)
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

    })
    // setInterval(() => {
    //     BroadcastInterface.closeDeadPeers(broadcast)
    // }, 5000)

    return broadcast
}