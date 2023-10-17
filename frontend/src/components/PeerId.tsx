import react, { useEffect, useState } from 'react';
import { eventBus } from '../lib/events/create-eventbus';
const PeerId = () => {
    const [PeerId, setPeerId] = useState<string>('')
    useEffect(() => {
        const listener = (id: string) => { setPeerId(id) }
        eventBus.on('peerId', listener);
        return () => {
            eventBus.off('peerId', listener)
        }
    }, [PeerId])
    return (
        <span>Your Id: {PeerId}</span>
    )
}

export default PeerId;