import mitt, { Emitter } from "mitt"
import { Descendant } from "../../types/Descendant"
import { BroadcastCrdtEvent, BroadcastSyncRequestEvent } from "../types/BroadcastEventTypes"
import { BroadcastOperation } from "../../types/BroadcastOperation"
type Events = {
    //broadcast -> controller
    'updateControllerUrlid': string,
    'request_initial_struct': void,
    'response_initial_struct': Descendant[],
    'handleSyncRequest': BroadcastSyncRequestEvent,

    //broadcast -> components
    'peerId': string,
    'handleRemoteOperation': BroadcastCrdtEvent

    //contoller -> editor
    'editorInitialValue': Descendant[],
    'enableEditor': boolean,

    //editor -> broadcast
    'insert': BroadcastCrdtEvent



}
export const eventBus: Emitter<Events> = mitt<Events>()