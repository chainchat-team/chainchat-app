import { Peer as PeerJs } from 'peerjs';
import { eventBus } from '../events/create-eventbus';
import { AddressInterface } from '../interfaces/Address';
import { fetchNetwork } from '../events/fetchNetwork';
export function createAddress(host: string, port: string, peerId: string, peerjs: PeerJs) {
    const address = {
        host: host,
        port: port,
        peerId: peerId
    }
    peerjs.on('open', (id) => {
        eventBus.on('broadcastAddToNetwork', ({ peerToBeAdded, peerSender, networkVersion }) => {
            if (address.peerId === '') {
                address.peerId = peerToBeAdded.peerId
                window.history.pushState({}, '', AddressInterface.getUrl(address))
            }

        })

        eventBus.on('broadcastRemoveFromNetwork', async ({ peerToBeRemoved, peerSender, networkVersion, connectionType }) => {
            if (address.peerId === peerToBeRemoved.peerId) {
                const network = await fetchNetwork()
                const possibleNextConnections = network.globalPeers.filter(peer =>
                    peer.peerId !== address.peerId || peer.peerId !== id)
                if (possibleNextConnections.length > 1) {
                    const randomIdx = Math.floor(Math.random() * possibleNextConnections.length);
                    const nextPossiblePeer = possibleNextConnections[randomIdx];
                    address.peerId = nextPossiblePeer.peerId
                    window.history.pushState({}, '', AddressInterface.getUrl(address))
                } else {
                    address.peerId = ''
                    window.history.pushState({}, '', AddressInterface.getUrl(address))
                }
            }
        })
    })

}