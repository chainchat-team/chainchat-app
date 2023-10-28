import { eventBus } from "../events/create-eventbus"
import { Network, NetworkInterface } from "../interfaces/Network"
import { Peer } from "../types/Peer"

export const createNetwork = (): Network => {
    const network: Network = {
        globalPeers: []
    }
    eventBus.on('addToNetwork', ({ peerToBeAdded, peerSender }) => {
        const isAdded = NetworkInterface.addToNetwork(network, peerToBeAdded)
        if (!!isAdded) {
            eventBus.emit('broadcastAddToNetwork', { peerToBeAdded: peerToBeAdded, peerSender: peerSender })
        }
    })
    eventBus.on('removeFromNetwork', ({ peerToBeRemoved, peerSender }) => {

        const isRemoved = NetworkInterface.removeFromNetwork(network, peerToBeRemoved)
        console.log('-----removeFromNetwork-----')
        console.log(peerToBeRemoved)
        console.log(isRemoved)
        console.log(network.globalPeers)
        console.log('-----removeFromNetwork-----')
        if (!!isRemoved) {
            eventBus.emit('broadcastRemoveFromNetwork', { peerToBeRemoved: peerToBeRemoved, peerSender: peerSender })
        }
    })
    eventBus.on('requestNetwork', () => {
        eventBus.emit('responseNetwork', { globalPeers: network.globalPeers })
    })
    eventBus.on('initNetwork', (initNetwork: Network) => {
        NetworkInterface.initNetwork(network, initNetwork)
    })

    return network
}