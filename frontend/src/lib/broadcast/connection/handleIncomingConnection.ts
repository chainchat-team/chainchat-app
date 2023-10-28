import { Peer as PeerJs, DataConnection } from "peerjs";
import { Broadcast, BroadcastInterface } from "../../interfaces/Broadcast";
import { eventBus } from "../../events/create-eventbus";
import { Descendant } from "../../../types/Descendant";
import { BroadcastCrdtEvent, BroadcastEvent, BroadcastSyncRequestOperation } from "../../types/BroadcastEventTypes";
import { PeerCrdtEvent, PeerEvent, PeerSyncRequestEvent } from "../../types/PeerEventTypes";
import { Network } from "../../interfaces/Network";
import { Peer } from "../../types/Peer";


export function handleIncomingConnection(broadcast: Broadcast, peerjs: PeerJs) {
    peerjs.on('connection', (connection: DataConnection) => {
        // BroadcastInterface.addOutGoingConnection(broadcast, connection)
        connection.on('open', () => {
            eventBus.on('insert', (data: BroadcastCrdtEvent) => {
                console.log('--inserting---')
                console.log(connection.peerConnection.iceConnectionState)
                console.log('--inserting---')
                console.log(broadcast.incomingConnections)
                broadcast.incomingConnections.forEach(peer => peer.connection?.send(data as PeerCrdtEvent))
            })
            eventBus.on('delete', (data: BroadcastCrdtEvent) => {
                broadcast.incomingConnections.forEach(peer => peer.connection?.send(data as PeerCrdtEvent))
            })

        });
        connection.on('data', (data: any) => {
            console.log(data)
            switch (data.type) {
                case 'connRequest':
                    BroadcastInterface.addIncomingConnection(broadcast,
                        {
                            peerId: data.peerId,
                            siteId: data.siteId,
                            connection: connection
                        }
                    )
                    var network: Partial<Network>;
                    const responseInitialStructListener = (initalStruct: Descendant[]) => {
                        const initialData: PeerSyncRequestEvent = {
                            type: 'syncRequest',
                            siteId: broadcast.siteId,
                            peerId: peerjs.id,
                            initialStruct: initalStruct,
                            // version: 
                            network: network
                        };
                        connection.send(initialData);
                        console.log('---conrequest----')
                        console.log(data)
                        console.log('---conrequest----')
                        const payload = {
                            peerToBeAdded: { peerId: data.peerId, siteId: data.siteId },
                            peerSender: { peerId: peerjs.id, siteId: broadcast.siteId }
                        }
                        eventBus.emit('addToNetwork', payload)
                        eventBus.off('response_initial_struct', responseInitialStructListener)
                    }
                    eventBus.on('response_initial_struct', responseInitialStructListener);
                    const responseNetworkListener = (argNetwork: Partial<Network>) => {
                        network = argNetwork
                        eventBus.emit('request_initial_struct');
                        eventBus.off('responseNetwork', responseNetworkListener)
                    }
                    eventBus.on('responseNetwork', responseNetworkListener)
                    eventBus.emit('requestNetwork')
                    break
                case 'addToNetwork':
                    eventBus.emit('addToNetwork',
                        {
                            peerToBeAdded: data.peerToBeAdded,
                            peerSender: { peerId: peerjs.id, siteId: broadcast.siteId }
                        }
                    )
                    break
                case 'removeFromNetwork':
                    eventBus.emit('removeFromNetwork',
                        {
                            peerToBeRemoved: data.peerToBeRemoved,
                            peerSender: { peerId: peerjs.id, siteId: broadcast.siteId }
                        }
                    )
                    break
                default:
                    eventBus.emit('handleRemoteOperation', data as BroadcastCrdtEvent)
                    break;
            }

        });

        connection.on('error', () => { console.log('some error') });
        connection.on('close', () => {
            const peerToBeRemoved = BroadcastInterface.getIncomingPeer(broadcast, connection)
            eventBus.emit('removeFromNetwork',
                {
                    peerToBeRemoved: peerToBeRemoved,
                    peerSender: { peerId: peerjs.id, siteId: broadcast.siteId }
                }
            )
        });
    });
}
