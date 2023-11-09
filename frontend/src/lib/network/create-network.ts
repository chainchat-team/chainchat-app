import { eventBus } from "../events/create-eventbus"
import { Network, NetworkInterface } from "../interfaces/Network"
import { VersionVectorInterface } from "../interfaces/VersionVector"
import { Peer } from "../types/Peer"
import { Peer as PeerJs } from 'peerjs'

export const createNetwork = (peerjs: PeerJs, siteId: string): Network => {
    const network: Network = {
        globalPeers: [],
        versionVector: null,
        peerConnectionsCount: {}
    }
    peerjs.on('open', (id: string) => {
        const peer: Peer = { siteId: siteId, peerId: id }
        network.peerConnectionsCount[id] = 0
        network.versionVector = {
            versions: [{ peer: peer, counter: 0, exceptions: [] }],
            localVersion: { peer: peer, counter: 0, exceptions: [] }
        }
        network.globalPeers.push(peer)

        eventBus.on('addToNetwork', ({ peerToBeAdded, peerSender, networkVersion }) => {
            if (network.versionVector === null) throw new Error('Network version vector is null.')
            if (VersionVectorInterface.hasBeenApplied(network.versionVector, networkVersion)) return

            if (network.versionVector.localVersion.peer.peerId === networkVersion.peer.peerId) {
                network.versionVector = VersionVectorInterface.increment(network.versionVector)
            } else {
                network.versionVector = VersionVectorInterface.update(network.versionVector, networkVersion)
            }

            NetworkInterface.addToNetwork(network, peerToBeAdded)
            const peerCount = network.peerConnectionsCount[networkVersion.peer.peerId] || 0
            network.peerConnectionsCount[networkVersion.peer.peerId] = peerCount + 1
            eventBus.emit('broadcastAddToNetwork', { peerToBeAdded: peerToBeAdded, peerSender: peerSender, networkVersion: networkVersion })
            eventBus.emit('updateNetwork', network)
        })
        eventBus.on('removeFromNetwork', ({ peerToBeRemoved, peerSender, networkVersion, connectionType }) => {
            if (network.versionVector === null) throw new Error('Network version vector is null.')
            if (VersionVectorInterface.hasBeenApplied(network.versionVector, networkVersion)) return
            const isRemoved = NetworkInterface.removeFromNetwork(network, peerToBeRemoved)
            if (network.versionVector.localVersion.peer.peerId === networkVersion.peer.peerId) {
                network.versionVector = VersionVectorInterface.increment(network.versionVector)
            } else {
                network.versionVector = VersionVectorInterface.update(network.versionVector, networkVersion)
            }
            console.log('-----removeFromNetwork-----')
            console.log(peerToBeRemoved)
            console.log(peerSender)
            console.log(isRemoved)
            console.log(network.globalPeers)
            console.log('-----removeFromNetwork-----')
            if (!!isRemoved) {
                if (connectionType === 'in') {
                    const peerCount = network.peerConnectionsCount[networkVersion.peer.peerId] || 0
                    network.peerConnectionsCount[networkVersion.peer.peerId] = peerCount - 1
                }
                eventBus.emit('broadcastRemoveFromNetwork', {
                    peerToBeRemoved: peerToBeRemoved,
                    peerSender: peerSender,
                    networkVersion: networkVersion,
                    connectionType: connectionType
                })
                eventBus.emit('updateNetwork', network)
            }
        })
        eventBus.on('requestNetwork', () => {
            eventBus.emit('responseNetwork', { ...network })
        })

        eventBus.on('initNetwork', (initNetwork: Network) => {
            NetworkInterface.initNetwork(network, initNetwork)
            eventBus.emit('initNetworkComplete', network)
            eventBus.emit('updateNetwork', network)
        })

        eventBus.on('requestNetworkVersionVector', () => {
            if (network.versionVector === null) throw new Error('Network version vector is null.')
            eventBus.emit('responseNetworkVersionVector', network.versionVector)
        })

        eventBus.on('incrementVersionVector', () => {
            if (network.versionVector === null) throw new Error('Network version vector is null.')
            network.versionVector = VersionVectorInterface.increment(network.versionVector)
            eventBus.emit('responseIncrementVersionVector')
        })


    })
    return network
}