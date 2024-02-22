import { Broadcast } from "../../interfaces/Broadcast";
import { PeerConnectionManagementInterface } from "../../interfaces/PeerConnectionManagement";

export function acceptConnRequest(broadcast: Broadcast, peerId: string, siteId: string) {
    const connection = broadcast.peer.connect(peerId);

    PeerConnectionManagementInterface.addToInConns(broadcast, connection)

    ControllerInterface.addToNetwork(broadcast.controller, peerId, siteId)

    const initalData = JSON.stringify({
        type: 'syncResponse',
        siteId: broadcast.controller.siteId,
        peerId: broadcast.peer.id,
        initialStruct: broadcast.controller.editor.children,
    });
    if (connection.open) {
        connection.send(initalData);
    } else {
        connection.on('open', () => {
            connection.send(initalData)
        })
    }
}
