import Peer, { DataConnection } from "peerjs";
import { Broadcast, BroadcastInterface } from "../../interfaces/Broadcast";
import { eventBus } from "../../events/create-eventbus";
import { BroadcastCrdtEvent, BroadcastSyncRequestEvent } from "../../types/BroadcastEventTypes";
import { PeerCrdtEvent, PeerEvent } from "../../types/PeerEventTypes";
// import { Controller, ControllerInterface } from "../../interfaces/Controller";
export function handleOutgoingConnection(broadcast: Broadcast, peer: Peer, targetId: string) {
    const connection: DataConnection = peer.connect(targetId)
    connection.on('open', () => {
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
                    console.log('---data-remoteFromNetwor----')
                    console.log(data.peerToBeRemoved)
                    console.log('---data-remoteFromNetwor----')
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
            if (!broadcast._isCloser) {
                const peerToBeRemoved = BroadcastInterface.getOutgoingPeer(broadcast, connection)
                console.log('--onClose-----')
                console.log(peerToBeRemoved)
                console.log('--onClose-----')
                eventBus.emit('removeFromNetwork',
                    {
                        peerToBeRemoved: peerToBeRemoved,
                        peerSender: { peerId: peer.id, siteId: broadcast.siteId }
                    }
                );
                // BroadcastInterface.findNewTarget(broadcast)

            }
        });
    })

}

