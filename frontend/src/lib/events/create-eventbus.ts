import mitt, { Emitter } from "mitt"
import { Descendant } from "../../types/Descendant"
import { BroadcastCrdtEvent, BroadcastSyncRequestEvent } from "../types/BroadcastEventTypes"
import { BroadcastOperation } from "../../types/BroadcastOperation"
import { Peer } from "../types/Peer"
import { Network } from "../interfaces/Network"
type Events = {
    //broadcast -> controller
    'updateControllerUrlid': string,
    'request_initial_struct': void,
    'response_initial_struct': Descendant[],
    'handleSyncRequest': BroadcastSyncRequestEvent,

    //broadcast -> components
    'peerId': string,
    'handleRemoteOperation': BroadcastCrdtEvent

    //broadcast -> network
    'addToNetwork': { peerToBeAdded: Peer, peerSender: Peer },
    'removeFromNetwork': { peerToBeRemoved: Peer, peerSender: Peer },
    'requestNetwork': void,
    'initNetwork': Network

    //network -> broadcast
    'broadcastAddToNetwork': { peerToBeAdded: Peer, peerSender: Peer }
    'broadcastRemoveFromNetwork': { peerToBeRemoved: Peer, peerSender: Peer }
    'responseNetwork': Network

    //contoller -> editor
    'editorInitialValue': Descendant[],
    'enableEditor': boolean,

    //editor -> broadcast
    'insert': BroadcastCrdtEvent
    'delete': BroadcastCrdtEvent






}
export const eventBus: Emitter<Events> = mitt<Events>()