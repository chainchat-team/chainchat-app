import { Peer as PeerJs, DataConnection } from "peerjs";
import { Broadcast, BroadcastInterface } from "../../interfaces/Broadcast";
import { eventBus } from "../../events/create-eventbus";
import { Descendant } from "../../../types/Descendant";
import { BroadcastCrdtEvent, BroadcastEvent, BroadcastSyncRequestOperation } from "../../types/BroadcastEventTypes";
import { PeerCrdtEvent, PeerEvent, PeerSyncRequestEvent } from "../../types/PeerEventTypes";
import { Network } from "../../interfaces/Network";
import { Peer } from "../../types/Peer";
import { VersionVector, VersionVectorInterface } from "../../interfaces/VersionVector";
import { Version } from "../../interfaces/Version";
import { version } from "react";
import { fetchNetwork } from "../../events/fetchNetwork";
import { fetchCrdt } from "../../events/fetchCrdt";
import { fetchEditorDescendant } from "../../events/fetchEditorDescendant";
import initialValue from "../../../slateInitialValue";


export function handleIncomingConnection(broadcast: Broadcast, peerjs: PeerJs) {
    peerjs.on('connection', (connection: DataConnection) => {
        connection.on('open', () => {

        });
        connection.on('data', async (data: any) => {
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
                    var network = await fetchNetwork()
                    if (network.versionVector === null) throw new Error('Network version vector is null.')
                    const networkVersion = VersionVectorInterface.getLocalVersion(network.versionVector)
                    networkVersion.counter++;
                    const payload = {
                        peerToBeAdded: { peerId: data.peerId, siteId: data.siteId },
                        peerSender: { peerId: peerjs.id, siteId: broadcast.siteId },
                        networkVersion: networkVersion
                    }
                    eventBus.emit('addToNetwork', payload)

                    const crdt = await fetchCrdt()
                    const initalStruct = await fetchEditorDescendant()
                    network = await fetchNetwork()
                    if (crdt.versionVector === null) throw new Error('Crdt version vector is null.')
                    const initialData: PeerSyncRequestEvent = {
                        type: 'syncRequest',
                        siteId: broadcast.siteId,
                        peerId: peerjs.id,
                        initialStruct: initalStruct,
                        versionVector: crdt.versionVector,
                        network: network
                    };
                    connection.send(initialData);
                    break
                case 'addToNetwork':
                    eventBus.emit('addToNetwork',
                        {
                            peerToBeAdded: data.peerToBeAdded,
                            peerSender: { peerId: peerjs.id, siteId: broadcast.siteId },
                            networkVersion: data.networkVersion
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
