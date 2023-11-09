import Peer, { DataConnection } from "peerjs";
import { eventBus } from "../events/create-eventbus";
import { Broadcast, BroadcastInterface } from "../interfaces/Broadcast";
import { Network } from "../interfaces/Network";

export function findNewTarget(broadcast: Broadcast) {
    console.log('----findingNewTarget----')
    // find the peer that are not directly connected to you.
    // the question is how are we going to get the 
    // I guess we can request for current network list... and do things that way...
    const responseNetworkListener = (network: Network) => {
        const allConnectedPeers: string[] = [
            ...broadcast.incomingConnections.map(item => item.peerId),
            ...broadcast.outgoingConnections.map(item => item.peerId),
            broadcast.peer.id
        ]
        console.log(allConnectedPeers)
        const possibleTargets = network.globalPeers.filter(item => !allConnectedPeers.includes(item.peerId))
        console.log(network.globalPeers)
        console.log(possibleTargets)

        if (possibleTargets.length === 0) {
            console.log('could not find new target. no possible target.')
            // const changeUrlOnConnectionListener = (connection: DataConnection) => {
            //     const newUrl = `${location.host}/?${connection.peer}`
            //     window.history.pushState({}, newUrl)
            //     broadcast.peer.off('connection', changeUrlOnConnectionListener)
            // }
            // broadcast.peer.on('connection', changeUrlOnConnectionListener)

        } else {
            const randomIdx = Math.floor(Math.random() * possibleTargets.length);
            const newTarget = possibleTargets[randomIdx].peerId;
            console.log(`Found 1 possible target: ${newTarget}`)
            console.log(newTarget < broadcast.peer.id)
            if (newTarget < broadcast.peer.id) {
                console.log(`Trying to connect to new target: ${newTarget}`)
                BroadcastInterface.handleOutgoingConnection(broadcast, broadcast.peer, newTarget)
            }
        }
        eventBus.off('responseNetwork', responseNetworkListener)
    }
    eventBus.on('responseNetwork', responseNetworkListener)

    eventBus.emit('requestNetwork')

    console.log('----findingNewTarget----')
}