import mitt, { Emitter } from "mitt"
import { Descendant } from "../../types/Descendant"
import { BroadcastCrdtEvent, BroadcastSyncRequestEvent } from "../types/BroadcastEventTypes"
import { BroadcastOperation } from "../../types/BroadcastOperation"
import { Peer } from "../types/Peer"
import { Network } from "../interfaces/Network"
import { VersionVector } from "../interfaces/VersionVector"
import { Version } from "../interfaces/Version"
import { Crdt } from "../interfaces/Crdt"
type Events = {
    //crdt -> broadcast
    'responseVersionVector': Partial<VersionVector>
    //broadcast -> controller
    'updateControllerUrlid': string,
    'request_initial_struct': void,
    'response_initial_struct': Descendant[],
    'handleSyncRequest': BroadcastSyncRequestEvent,
    //broadcast -> crdt
    'requestVersionVector': void

    //broadcast -> components
    'peerId': string,
    'handleRemoteOperation': BroadcastCrdtEvent

    //broadcast -> network
    'addToNetwork': { peerToBeAdded: Peer, peerSender: Peer, networkVersion: Version },
    'removeFromNetwork': { peerToBeRemoved: Peer, peerSender: Peer, networkVersion: Version, connectionType: 'in' | 'out' },
    'requestNetwork': void,
    'initNetwork': Network
    'requestNetworkVersionVector': void,
    'responseNetworkVersionVector': VersionVector,

    //network -> broadcast
    'broadcastAddToNetwork': { peerToBeAdded: Peer, peerSender: Peer, networkVersion: Version }
    'broadcastRemoveFromNetwork': { peerToBeRemoved: Peer, peerSender: Peer, networkVersion: Version, connectionType: 'in' | 'out' }
    'responseNetwork': Network
    'incrementVersionVector': void
    'responseIncrementVersionVector': void

    //crdt -> everything else
    'requestCrdt': void
    'responseCrdt': Crdt

    //editor -> everything else
    'requestEditorDescendant': void
    'responseEditorDescendant': Descendant[]

    //contoller -> editor
    'editorInitialValue': Descendant[],
    'enableEditor': boolean,

    //editor -> broadcast
    'insert': BroadcastCrdtEvent
    'delete': BroadcastCrdtEvent

    //peerjs -> everything
    'peer': Peer

    //for updateing page
    'updateUrl': string
    // for testing
    'requestCurrentTarget': void
    'responseCurrentTarget': Peer | null
    'initNetworkComplete': Network
    'requestPeerConnectionsCount': void,
    'responsePeerConnectionsCount': { [key: string]: number }
    'updateNetwork': Network



}
export const eventBus: Emitter<Events> = mitt<Events>()