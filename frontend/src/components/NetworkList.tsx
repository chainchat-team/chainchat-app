import React, { useState, useEffect } from 'react';
import { Network } from '../lib/interfaces/Network';
import { Peer } from '../lib/types/Peer';
import { eventBus } from '../lib/events/create-eventbus';


const NetworkList = () => {
    // Use state to manage the network data
    const [globalPeers, setGlobalPeers] = useState<Peer[]>([]);
    const [targetPeer, setTargetPeer] = useState<Peer | null>()
    const [peerID, setPeerId] = useState<string>('');
    // Use useEffect to update the network data when props change
    // Custom comparison function to sort peers by their peerId
    const comparePeers = (a: Peer, b: Peer) => {
        if (a.peerId < b.peerId) {
            return -1;
        }
        if (a.peerId > b.peerId) {
            return 1;
        }
        return 0;
    };


    useEffect(() => {
        const peerIdListener = (id: string) => { setPeerId(id) }
        eventBus.on('peerId', peerIdListener);

        const initNetworkCompleteListener = (network: Network) => {
            setGlobalPeers([
                ...network.globalPeers
            ].sort(comparePeers))
        }
        eventBus.on('initNetworkComplete', initNetworkCompleteListener)

        const broadcastAddToNetworkListener = ({ peerToBeAdded }: { peerToBeAdded: Peer }) => {
            setGlobalPeers(
                [
                    ...globalPeers,
                    peerToBeAdded
                ].sort(comparePeers)
            )
        }
        eventBus.on('broadcastAddToNetwork', broadcastAddToNetworkListener)

        const broadcastRemoveFromNetworkListener = ({ peerToBeRemoved }: { peerToBeRemoved: Peer }) => {
            const peer = globalPeers.find(peer => peer.peerId === peerToBeRemoved.peerId)
            if (peer !== undefined) {
                const idx = globalPeers.indexOf(peer)
                setGlobalPeers([
                    ...globalPeers.slice(0, idx),
                    ...globalPeers.slice(idx + 1)
                ].sort(comparePeers))
            }
        }
        eventBus.on('broadcastRemoveFromNetwork', broadcastRemoveFromNetworkListener)

        const requestCurrentTarget = () => {
            eventBus.on('responseCurrentTarget', (peer: Peer | null) => {
                setTargetPeer(peer)
            })
            eventBus.emit('requestCurrentTarget')
        }
        requestCurrentTarget()
        return () => {
            eventBus.off('peerId', peerIdListener)
            eventBus.off('initNetworkComplete', initNetworkCompleteListener)
            eventBus.off('broadcastAddToNetwork', broadcastAddToNetworkListener)
            eventBus.off('broadcastRemoveFromNetwork', broadcastRemoveFromNetworkListener)
        }
    }, [globalPeers, targetPeer, peerID]);

    return (
        <div>
            <p>Network List</p>
            <ul>
                {globalPeers.map((peer, index) => (
                    <li key={index}>
                        {peer.peerId}
                        {peer.peerId === peerID && <span> (You)</span>}
                        {peer.peerId === targetPeer?.peerId && <span> (Connected To)</span>}
                    </li>
                ))}
            </ul>
            <p>Target Peer: {targetPeer?.peerId}</p>
        </div>
    );
};

export default NetworkList;
