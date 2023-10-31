import Peer, { DataConnection } from "peerjs";
import { eventBus } from "../events/create-eventbus";
import { Broadcast, BroadcastInterface } from "../interfaces/Broadcast";

export function findNewTarget(broadcast: Broadcast) {
    // find the peer that are not directly connected to you.
    const allConnectedPeers: string[] = [
        ...broadcast.incomingConnections.map(item => item.peerId),
        ...broadcast.outgoingConnections.map(item => item.peerId)
    ]
    allConnectedPeers.push(broadcast.peer.id)
    // the question is how are we going to get the 
    // I guess we can request for current network list... and do things that way...
    eventBus.on('responseNetwork', (network) => {
        const possibleTargets = network.globalPeers.filter(item => allConnectedPeers.indexOf(item.peerId))

        if (possibleTargets.length === 0) {
            const changeUrlOnConnectionListener = (connection: DataConnection) => {
                const newUrl = `${location.host}/?${connection.peer}`
                window.history.pushState({}, newUrl)
            }
            broadcast.peer.on('connection', changeUrlOnConnectionListener)

        } else {
            const randomIdx = Math.floor(Math.random() * possibleTargets.length);
            const newTarget = possibleTargets[randomIdx].peerId;
            console.log(newTarget < broadcast.peer.id)
            if (newTarget < broadcast.peer.id) {
                BroadcastInterface.handleOutgoingConnection(broadcast, broadcast.peer, newTarget)
            }
        }
    })
    eventBus.emit('requestNetwork')

}