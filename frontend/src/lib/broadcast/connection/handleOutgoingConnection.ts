import Peer, { DataConnection } from "peerjs";
import { Broadcast, BroadcastInterface } from "../../interfaces/Broadcast";
import { eventBus } from "../../events/create-eventbus";
import { BroadcastCrdtEvent, BroadcastSyncRequestEvent } from "../../types/BroadcastEventTypes";
import { PeerCrdtEvent, PeerEvent } from "../../types/PeerEventTypes";
// import { Controller, ControllerInterface } from "../../interfaces/Controller";
export function handleOutgoingConnection(broadcast: Broadcast, peer: Peer, targetId: string) {
    const connection: DataConnection = peer.connect(targetId)
    connection.on('open', () => {
        eventBus.on('insert', (data: BroadcastCrdtEvent) => {
            console.log('--inserting---')
            console.log(connection.peerConnection.iceConnectionState)
            console.log('--inserting---')
            broadcast.outgoingConnections.forEach(peer => peer.connection?.send(data as PeerCrdtEvent))
        })
        eventBus.on('delete', (data: BroadcastCrdtEvent) => {
            broadcast.outgoingConnections.forEach(peer => peer.connection?.send(data as PeerCrdtEvent))
        })
        connection.send({
            type: 'connRequest',
            peerId: peer.id,
            siteId: broadcast.siteId
        })
        connection.on('data', (data: any) => {
            console.log(data)
            switch (data.type) {
                case 'syncRequest':
                    BroadcastInterface.addOutGoingConnection(broadcast,
                        {
                            peerId: data.peerId,
                            siteId: data.siteId,
                            connection: connection
                        }
                    )
                    eventBus.emit('handleSyncRequest', data as BroadcastSyncRequestEvent)
                    eventBus.emit('initNetwork', data.network)
                    break
                case 'addToNetwork':
                    eventBus.emit('addToNetwork',
                        {
                            peerToBeAdded: data.peerToBeAdded,
                            peerSender: { peerId: peer.id, siteId: broadcast.siteId }
                        }
                    )
                    break
                case 'removeFromNetwork':
                    eventBus.emit('removeFromNetwork',
                        {
                            peerToBeRemoved: data.peerToBeRemoved,
                            peerSender: { peerId: peer.id, siteId: broadcast.siteId }
                        }
                    )
                    break
                default:
                    eventBus.emit('handleRemoteOperation', data as BroadcastCrdtEvent)
                    break
            }
        })
        connection.on('error', () => { })
        connection.on('close', () => {
            console.log('--onClose-----')
            console.log('--onClose-----')
            const peerToBeRemoved = BroadcastInterface.getOutgoingPeer(broadcast, connection)
            eventBus.emit('removeFromNetwork',
                {
                    peerToBeRemoved: peerToBeRemoved,
                    peerSender: { peerId: peer.id, siteId: broadcast.siteId }
                }
            )
        })
    })

}

