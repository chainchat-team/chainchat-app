import react, { useEffect, useState } from 'react';
import { eventBus } from '../lib/events/create-eventbus';
type PropsType = {
    peerId: string | null
}
const PeerId = ({ peerId }: PropsType) => {
    return (
        <>
            {peerId ? (<span> Your Id: {peerId}</span >) : (<span>Peer id is null</span>)}
        </>
    )
}

export default PeerId;