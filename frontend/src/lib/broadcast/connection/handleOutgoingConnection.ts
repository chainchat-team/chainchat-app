import Peer, { DataConnection } from "peerjs";
import { Broadcast, BroadcastInterface } from "../../interfaces/Broadcast";
import { eventBus } from "../../events/create-eventbus";
import { BroadcastCrdtEvent, BroadcastSyncRequestEvent } from "../../types/BroadcastEventTypes";
import { PeerCrdtEvent, PeerEvent } from "../../types/PeerEventTypes";
// import { Controller, ControllerInterface } from "../../interfaces/Controller";
export function handleOutgoingConnection(broadcast: Broadcast, peer: Peer, targetId: string) {
    const connection: DataConnection = peer.connect(targetId)
    connection.on('open', () => {
        // BroadcastInterface.addIncomingConnection(broadcast, connection)
        BroadcastInterface.addOutGoingConnection(broadcast, connection)
        eventBus.on('insert', (data: BroadcastCrdtEvent) => {
            broadcast.outgoingConnections.forEach(conn => conn.send(data as PeerCrdtEvent))
        })
        eventBus.on('delete', (data: BroadcastCrdtEvent) => {
            broadcast.outgoingConnections.forEach(conn => conn.send(data as PeerCrdtEvent))
        })
        connection.send({
            type: 'connRequest',
            peerId: peer.id,
            siteId: broadcast.siteId
        })
        connection.on('data', (data: any) => {
            switch (data.type) {
                case 'syncRequest':
                    eventBus.emit('handleSyncRequest', data as BroadcastSyncRequestEvent)
                    eventBus.emit('initNetwork', data.network)
                    break
                case 'addToNetwork':
                    const payload = {
                        peerToBeAdded: { peerId: data.peerId, siteId: data.siteId },
                        peerSender: { peerId: connection.peer, siteId: data.siteId }
                    }
                    eventBus.emit('addToNetwork', payload)
                    break
                case 'removeFromNetwork':
                    eventBus.emit('removeFromNetwork', { peerId: data.peerId, siteId: data.siteId })
                    break
                default:
                    eventBus.emit('handleRemoteOperation', data as BroadcastCrdtEvent)
                    break
            }
        })
        connection.on('error', () => { })
        connection.on('close', () => {
        })
    })

}

