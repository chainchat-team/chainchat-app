import Peer, { DataConnection } from "peerjs";
import { Broadcast, BroadcastInterface } from "../../interfaces/Broadcast";
import { eventBus } from "../../events/create-eventbus";
import { Descendant } from "../../../types/Descendant";
import { BroadcastCrdtEvent, BroadcastEvent, BroadcastSyncRequestOperation } from "../../types/BroadcastEventTypes";
import { PeerCrdtEvent, PeerEvent, PeerSyncRequestEvent } from "../../types/PeerEventTypes";

export function handleIncomingConnection(broadcast: Broadcast, peer: Peer) {
    peer.on('connection', (connection: DataConnection) => {
        BroadcastInterface.addIncomingConnection(broadcast, connection)
        BroadcastInterface.addOutGoingConnection(broadcast, connection)
        connection.on('open', () => {
            eventBus.on('insert', (data: BroadcastCrdtEvent) => {
                connection.send(data as PeerCrdtEvent)
            })
            eventBus.on('delete', (data: BroadcastCrdtEvent) => {
                connection.send(data as PeerCrdtEvent)
            })
            connection.on('data', (data: any) => {
                console.log(data)
                switch (data.type) {
                    case 'connRequest':
                        eventBus.on('response_initial_struct', (initialStruct: Descendant[]) => {
                            const initialData: PeerSyncRequestEvent = {
                                type: 'syncRequest',
                                siteId: broadcast.siteId,
                                peerId: peer.id,
                                initialStruct: initialStruct,
                                // version: 
                            };
                            connection.send(initialData);
                        });
                        eventBus.emit('request_initial_struct');
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
