import { Peer as PeerJs, DataConnection } from "peerjs";
import { Broadcast, BroadcastInterface } from "../../interfaces/Broadcast";
import { eventBus } from "../../events/create-eventbus";
import { Descendant } from "../../../types/Descendant";
import { BroadcastCrdtEvent, BroadcastEvent, BroadcastSyncRequestOperation } from "../../types/BroadcastEventTypes";
import { PeerCrdtEvent, PeerEvent, PeerSyncRequestEvent } from "../../types/PeerEventTypes";
import { Network } from "../../interfaces/Network";
import { Peer } from "../../types/Peer";
import { VersionVector } from "../../interfaces/VersionVector";


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
                    var versionVector: Partial<VersionVector>;
                    const responseInitialStructListener = (initalStruct: Descendant[]) => {
                        const initialData: PeerSyncRequestEvent = {
                            type: 'syncRequest',
                            siteId: broadcast.siteId,
                            peerId: peerjs.id,
                            initialStruct: initalStruct,
                            versionVector: versionVector,
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
                    const responseVersionVectorListener = (argVersionVector: Partial<VersionVector>) => {
                        versionVector = argVersionVector
                        eventBus.emit('request_initial_struct');
                        eventBus.off('responseVersionVector', responseVersionVectorListener)
                    }
                    const responseNetworkListener = (argNetwork: Partial<Network>) => {
                        network = argNetwork
                        eventBus.emit('requestVersionVector');
                        eventBus.off('responseNetwork', responseNetworkListener)
                    }
                    eventBus.on('responseVersionVector', responseVersionVectorListener)
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

        // connection.on('error', () => { console.log('some error') });
        connection.on('close', () => {
            if (!broadcast._isCloser) {
                const peerToBeRemoved = BroadcastInterface.getIncomingPeer(broadcast, connection)
                const broadcastRemoveFromNetworkListener = (payload: any) => {
                    BroadcastInterface.findNewTarget(broadcast)
                    eventBus.off('broadcastRemoveFromNetwork', broadcastRemoveFromNetworkListener)
                }
                eventBus.on('broadcastRemoveFromNetwork', broadcastRemoveFromNetworkListener)
                eventBus.emit('removeFromNetwork',
                    {
                        peerToBeRemoved: peerToBeRemoved,
                        peerSender: { peerId: peerjs.id, siteId: broadcast.siteId }
                    }
                );
            }
        });

    });
}
