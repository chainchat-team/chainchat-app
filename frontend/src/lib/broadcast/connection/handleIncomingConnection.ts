import Peer, { DataConnection } from "peerjs";
import { Broadcast, BroadcastInterface } from "../../interfaces/Broadcast";
import { eventBus } from "../../events/create-eventbus";
import { Descendant } from "../../../types/Descendant";
import { BroadcastCrdtEvent, BroadcastEvent, BroadcastSyncRequestOperation } from "../../types/BroadcastEventTypes";
import { PeerCrdtEvent, PeerEvent, PeerSyncRequestEvent } from "../../types/PeerEventTypes";
import { Network } from "../../interfaces/Network";


export function handleIncomingConnection(broadcast: Broadcast, peer: Peer) {
    peer.on('connection', (connection: DataConnection) => {
        BroadcastInterface.addIncomingConnection(broadcast, connection)
        // BroadcastInterface.addOutGoingConnection(broadcast, connection)
        connection.on('open', () => {
            eventBus.on('insert', (data: BroadcastCrdtEvent) => {
                console.log(broadcast.incomingConnections)
                broadcast.incomingConnections.forEach(conn => conn.send(data as PeerCrdtEvent))
                // connection.send(data as PeerCrdtEvent)
            })
            eventBus.on('delete', (data: BroadcastCrdtEvent) => {
                broadcast.incomingConnections.forEach(conn => conn.send(data as PeerCrdtEvent))
                // connection.send(data as PeerCrdtEvent)
            })
            connection.on('data', (data: any) => {
                console.log(data)
                switch (data.type) {
                    case 'connRequest':
                        var network: Partial<Network>;
                        const responseInitialStructListener = (initalStruct: Descendant[]) => {
                            const initialData: PeerSyncRequestEvent = {
                                type: 'syncRequest',
                                siteId: broadcast.siteId,
                                peerId: peer.id,
                                initialStruct: initalStruct,
                                // version: 
                                network: network
                            };
                            connection.send(initialData);
                            const payload = {
                                peerToBeAdded: { peerId: data.peerId, siteId: data.siteId },
                                peerSender: { peerId: peer.id, siteId: broadcast.siteId }
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
                        const payload = {
                            peerToBeAdded: { peerId: data.peerId, siteId: data.siteId },
                            peerSender: { peerId: data.peerId, siteId: data.siteId }
                        }
                        eventBus.emit('addToNetwork', payload)
                        break
                    case 'removeFromNetwork':
                        eventBus.emit('removeFromNetwork', { peerId: data.peerId, siteId: data.siteId })
                        break
                    default:
                        eventBus.emit('handleRemoteOperation', data as BroadcastCrdtEvent)
                        break;
                }
                connection.on('error', () => { });
                connection.on('close', () => { });
            });
        });
    });
}
