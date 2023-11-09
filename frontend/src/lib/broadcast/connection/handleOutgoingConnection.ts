import Peer, { DataConnection } from "peerjs";
import { Broadcast, BroadcastInterface } from "../../interfaces/Broadcast";
import { eventBus } from "../../events/create-eventbus";
import { BroadcastCrdtEvent, BroadcastSyncRequestEvent } from "../../types/BroadcastEventTypes";
import { PeerCrdtEvent, PeerEvent } from "../../types/PeerEventTypes";
import { Network } from "../../interfaces/Network";
import { fetchNetwork } from "../../events/fetchNetwork";
import { VersionVectorInterface } from "../../interfaces/VersionVector";
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
                            peerSender: { peerId: peer.id, siteId: broadcast.siteId },
                            networkVersion: data.networkVersion
                        }
                    )
                    break
                case 'removeFromNetwork':
                    eventBus.emit('removeFromNetwork',
                        {
                            peerToBeRemoved: data.peerToBeRemoved,
                            peerSender: { peerId: peer.id, siteId: broadcast.siteId },
                            networkVersion: data.networkVersion,
                            connectionType: data.connectionType
                        }
                    )
                    break
                default:
                    console.log('--emitting handlRemoteOperation---')
                    eventBus.emit('handleRemoteOperation', data as BroadcastCrdtEvent)
                    break
            }
        })
        connection.on('error', async () => {
            const peerToBeRemoved = BroadcastInterface.getOutgoingPeer(broadcast, connection)
            const broadcastRemoveFromNetworkListener = (payload: any) => {
                BroadcastInterface.findNewTarget(broadcast)
                eventBus.off('broadcastRemoveFromNetwork', broadcastRemoveFromNetworkListener)
            }
            eventBus.on('broadcastRemoveFromNetwork', broadcastRemoveFromNetworkListener)
            const network: Network = await fetchNetwork()
            if (network.versionVector === null) throw new Error('Network version vector is null.')
            const networkVersion = VersionVectorInterface.getLocalVersion(network.versionVector)
            networkVersion.counter++;
            eventBus.emit('removeFromNetwork',
                {
                    peerToBeRemoved: peerToBeRemoved,
                    peerSender: { peerId: peer.id, siteId: broadcast.siteId },
                    networkVersion: networkVersion,
                    connectionType: 'out'
                }
            );
        });
        connection.on('close', async () => {
            if (!broadcast._isCloser) {
                const peerToBeRemoved = BroadcastInterface.getOutgoingPeer(broadcast, connection)
                const broadcastRemoveFromNetworkListener = (payload: any) => {
                    BroadcastInterface.findNewTarget(broadcast)
                    eventBus.off('broadcastRemoveFromNetwork', broadcastRemoveFromNetworkListener)
                }
                eventBus.on('broadcastRemoveFromNetwork', broadcastRemoveFromNetworkListener)
                const network: Network = await fetchNetwork()
                if (network.versionVector === null) throw new Error('Network version vector is null.')
                const networkVersion = VersionVectorInterface.getLocalVersion(network.versionVector)
                networkVersion.counter++;
                eventBus.emit('removeFromNetwork',
                    {
                        peerToBeRemoved: peerToBeRemoved,
                        peerSender: { peerId: peer.id, siteId: broadcast.siteId },
                        networkVersion: networkVersion,
                        connectionType: 'out'
                    }
                );
            }
        });
    })

}

