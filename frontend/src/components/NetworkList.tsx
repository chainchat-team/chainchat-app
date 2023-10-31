import React, { useState, useEffect } from 'react';
import { Network } from '../lib/interfaces/Network';
import { Peer } from '../lib/types/Peer';
import { eventBus } from '../lib/events/create-eventbus';


const NetworkList = () => {
    // Use state to manage the network data
    const [globalPeers, setGlobalPeers] = useState<Peer[]>([]);

    // Use useEffect to update the network data when props change
    useEffect(() => {
        eventBus.on('initNetwork', (network) => {
            setGlobalPeers([
                ...globalPeers,
                ...network.globalPeers
            ])
        })
        eventBus.on('broadcastAddToNetwork', ({ peerToBeAdded }) => {
            setGlobalPeers(
                [
                    ...globalPeers,
                    peerToBeAdded
                ]
            )
        })
        eventBus.on('broadcastRemoveFromNetwork', ({ peerToBeRemoved }) => {
            const peer = globalPeers.find(peer => peer.peerId === peerToBeRemoved.peerId)
            if (peer !== undefined) {
                const idx = globalPeers.indexOf(peer)
                setGlobalPeers([
                    ...globalPeers.slice(0, idx),
                    ...globalPeers.slice(idx + 1)
                ])
            }
        })
    }, [globalPeers]);

    return (
        <div>
            <p>Network List</p>
            <ul>
                {globalPeers.map((peer, index) => (
                    <li key={index}>{peer.peerId}</li>
                ))}
            </ul>
        </div>
    );
};

export default NetworkList;
