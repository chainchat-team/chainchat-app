import Peer, { DataConnection } from "peerjs";
import { Broadcast, BroadcastInterface } from "../../interfaces/Broadcast";
import { eventBus } from "../../events/create-eventbus";
import { SyncRequest } from "../../types/SyncRequest";
import { Descendant } from "../../../types/Descendant";
import { BroadcastOperation } from "../../../types/BroadcastOperation";

export function handleIncomingConnection(broadcast: Broadcast, peer: Peer) {
    peer.on('connection', (connection: DataConnection) => {
        BroadcastInterface.addIncomingConnection(broadcast, connection)
        BroadcastInterface.addOutGoingConnection(broadcast, connection)
        connection.on('open', () => {
            connection.on('data', (payload: any) => {
                const data = JSON.parse(payload)
                switch (data.type) {
                    case 'connRequest':
                        eventBus.on('response_initial_struct', (initialStruct: Descendant[]) => {
                            const initialData: SyncRequest = {
                                type: 'syncRequest',
                                siteId: broadcast.siteId,
                                peerId: peer.id,
                                initialStruct: initialStruct,
                            };
                            connection.send(initialData);
                        });
                        eventBus.emit('request_initial_struct');

                    default:
                        eventBus.emit('handleRemoteOperation', data.operations)
                        break;
                }

                connection.on('error', () => { });
                connection.on('close', () => { });
            });
        });
    });
}
