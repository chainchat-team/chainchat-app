import Peer, { DataConnection } from "peerjs";
import { Broadcast, BroadcastInterface } from "../../interfaces/Broadcast";
import { eventBus } from "../../events/create-eventbus";
import { BroadcastCrdtEvent, BroadcastSyncRequestEvent } from "../../types/BroadcastEventTypes";
import { PeerCrdtEvent } from "../../types/PeerEventTypes";
// import { Controller, ControllerInterface } from "../../interfaces/Controller";
export function handleOutgoingConnection(broadcast: Broadcast, peer: Peer, targetId: string) {
    const connection: DataConnection = peer.connect(targetId)
    connection.on('open', () => {
        BroadcastInterface.addIncomingConnection(broadcast, connection)
        BroadcastInterface.addOutGoingConnection(broadcast, connection)
        eventBus.on('insert', (data: BroadcastCrdtEvent) => {
            connection.send(data as PeerCrdtEvent)
        })
        eventBus.on('delete', (data: BroadcastCrdtEvent) => {
            connection.send(data as PeerCrdtEvent)
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
                    eventBus.emit('handleSyncRequest', data as BroadcastSyncRequestEvent)
                    break
                default:
                    eventBus.emit('handleRemoteOperation', data as BroadcastCrdtEvent)
                    break
            }
        })
        connection.on('error', () => { })
        connection.on('close', () => { })
    })

}

