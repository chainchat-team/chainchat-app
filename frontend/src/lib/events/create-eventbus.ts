import mitt, { Emitter } from "mitt"
import { Descendant } from "../../types/Descendant"
import { SyncRequest } from "../types/SyncRequest"
import { BroadcastOperation } from "../../types/BroadcastOperation"
import { BaseOperation } from "slate"
type Events = {
    //broadcast -> controller
    'updateControllerUrlid': string,
    'request_initial_struct': void,
    'response_initial_struct': Descendant[],
    'handleSyncRequest': SyncRequest,

    //broadcast -> components
    'peerId': string,
    'handleRemoteOperation': BroadcastOperation

    //contoller -> editor
    'editorInitialValue': Descendant[],
    'enableEditor': boolean,

    //editor -> broadcast
    'insert': BroadcastOperation



}
export const eventBus: Emitter<Events> = mitt<Events>()