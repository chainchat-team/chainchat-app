import { eventBus } from "../events/create-eventbus"
import { Network, NetworkInterface } from "../interfaces/Network"
import { Peer } from "../types/Peer"

export const createNetwork = (): Network => {
    const network: Network = {
        globalPeers: []
    }
    eventBus.on('addToNetwork', ({ peerToBeAdded }) => {
        const isAdded = NetworkInterface.addToNetwork(network, peerToBeAdded)
    })
    eventBus.on('removeFromNetwork', peer => {
        const isRemoved = NetworkInterface.removeFromNetwork(network, peer)
        eventBus.emit('removeFromNetworkResponse', isRemoved)
    })
    eventBus.on('requestNetwork', () => {
        eventBus.emit('responseNetwork', { globalPeers: network.globalPeers })
    })
    eventBus.on('initNetwork', (initNetwork: Network) => {
        NetworkInterface.initNetwork(network, initNetwork)
    })

    return network
}