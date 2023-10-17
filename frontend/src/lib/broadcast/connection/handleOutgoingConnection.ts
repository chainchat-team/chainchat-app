import Peer, { DataConnection } from "peerjs";
import { Broadcast, BroadcastInterface } from "../../interfaces/Broadcast";
import { eventBus } from "../../events/create-eventbus";
import { SyncRequest } from "../../types/SyncRequest";
// import { Controller, ControllerInterface } from "../../interfaces/Controller";
export function handleOutgoingConnection(broadcast: Broadcast, peer: Peer, targetId: string) {
    const connection: DataConnection = peer.connect(targetId)
    connection.on('open', () => {
        BroadcastInterface.addIncomingConnection(broadcast, connection)
        BroadcastInterface.addOutGoingConnection(broadcast, connection)

        connection.send(JSON.stringify({
            type: 'connRequest',
            peerId: peer.id,
            siteId: broadcast.siteId
        }))
        connection.on('data', (data: any) => {
            console.log(data)
            switch (data.type) {
                case 'syncRequest':
                    eventBus.emit('handleSyncRequest', data as SyncRequest)
                default:
                    eventBus.emit('handleRemoteOperation', data.operations)
            }
        })
        connection.on('error', () => { })
        connection.on('close', () => { })
    })

}

