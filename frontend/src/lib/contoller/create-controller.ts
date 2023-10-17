import { Controller, ControllerInterface } from "../interfaces/Controller"
import { eventBus } from "../events/create-eventbus"
import { SyncRequest } from "../types/SyncRequest";

export const createController = (
    targetPeerId: string,
    host: string
): Controller => {
    var controller = {
        host: host,
        urlId: targetPeerId,
        doc: document,
    }
    eventBus.on('updateControllerUrlid', (newUrlId) => {
        controller = ControllerInterface.setUrlId(controller, newUrlId)
    });

    eventBus.on('handleSyncRequest', (req: SyncRequest) => {
        if (req.peerId !== controller.urlId) {
            controller = ControllerInterface.updatePageUrl(controller, req.peerId)
        }

        //2. Add to network

        //3.Populate CRDT and Version Vector
        // maybe the editor itself list for handleSyncRequest
        // eventBus.emit('editorInitialValue', req.initialStruct)
        // controller = ControllerInterface.populateVersionVector(controller,req.initialVersionVector)

        //4. Enable Doc
        // eventBus.emit('enableEditor', true)

        //5. Send out that you have synced
        // it should be peer that should be responsible for sending the the response
        // const completedMessage = JSON.stringify({
        //     type: 'syncCompleted',
        //     peerId: controller.peer.id
    });


})
return controller
}

