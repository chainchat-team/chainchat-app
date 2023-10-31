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
        connection.on('open', () => {

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
                    console.log('---data-remoteFromNetwor----')
                    console.log(data.peerToBeRemoved)
                    console.log('---data-remoteFromNetwor----')
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
            window.alert('close event recived')
            console.log('---close---')
            console.log(`received close from ${connection.peer}`)
            console.log('---close---')
            if (!broadcast._isCloser) {
                const peerToBeRemoved = BroadcastInterface.getIncomingPeer(broadcast, connection)
                eventBus.emit('removeFromNetwork',
                    {
                        peerToBeRemoved: peerToBeRemoved,
                        peerSender: { peerId: peerjs.id, siteId: broadcast.siteId }
                    }
                );
                // BroadcastInterface.findNewTarget(broadcast)
            }
        });

    });
}
