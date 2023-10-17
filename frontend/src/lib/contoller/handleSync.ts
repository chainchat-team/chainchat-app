import initialValue from "../../slateInitialValue";
import { Controller, ControllerInterface } from "../interfaces/Controller";
import { SyncResponse } from "../types/SyncRequest";

export function handleSync(contoller: Controller, syncResponse: SyncResponse) {
    //urlId === peerId   
    //what happen when crdt.total struct is not empty???

    // when we connect to a targetId, we lose whatever we we doing and just load
    ControllerInterface.emit(contoller, 'initalValue', initialValue)
    // ControllerInterface.populateVersionVector(syncResponse.initalVersions)
    // ControllerInterface.enableDoc()


}