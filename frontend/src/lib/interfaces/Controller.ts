import { handleSync } from "../contoller/handleSync";
import { setUrlId } from "../contoller/setUrlId";
import { SyncResponse } from "../types/BroadcastEventTypes";
export interface Controller {
    host: string,
    // id of peer that you are connected to
    urlId: string,
    doc: Document,

}
export interface ControllerInterface {
    setUrlId: (controller: Controller, urlId: string) => Controller,
    handleSync: (Controller: Controller, syncResponse: SyncResponse) => void
    enableDoc: (Controller: Controller) => void
}

export const ControllerInterface: ControllerInterface = {
    setUrlId: (...args) => setUrlId(...args),
    handleSync: (...args) => handleSync(...args),
    enableDoc: (...args) => () => { },
}


