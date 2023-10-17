import { Broadcast } from "../../interfaces/Broadcast"
import { Controller, ControllerInterface } from "../../interfaces/Controller"
export function bindServerEvents(broadcast: Broadcast, controller: Controller, targetPeerId: string): void {
    broadcast.peer.on('open', id => {
        ControllerInterface.updateShareLink(controller, id)
        broadcast.peer.on('connection', (connection) => {

            //onConnection
            ControllerInterface.updateRootUrl(controller, connection.peer);
            if (!!connection && BroadcastInterface.isAlreadyConnectedIn(connection)) {
                BroadcastInterface.addInConnsConnection(connection);
            }

            //onData 
            connection.on('data', data => {
                const dataObj = JSON.parse(data);

                switch (dataObj.type) {
                    case 'connRequest':
                        BroadcastInterface.evaluateRequest(dataObj.peerId, dataObj.siteId);
                        break;
                    case 'syncResponse':
                        BroadcastInterface.processOutgoingBuffer(dataObj.peerId);
                        BroadcastInterface.controller.handleSync(dataObj);
                        break;
                    case 'syncCompleted':
                        BroadcastInterface.processOutgoingBuffer(dataObj.peerId);
                        break;
                    case 'add to network':
                        BroadcastInterface.controller.addToNetwork(dataObj.newPeer, dataObj.newSite);
                        break;
                    case 'remove from network':
                        BroadcastInterface.controller.removeFromNetwork(dataObj.oldPeer);
                        break;
                    default:
                        BroadcastInterface.controller.handleRemoteOperation(dataObj);
                }
            })

            //onConnClose
            connection.on('close', () => {
                BroadcastInterface.removeFromConnections(connection.peer);
                if (connection.peer == BroadcastInterface.controller.urlId) {
                    const id = BroadcastInterface.randomId();
                    if (id) { BroadcastInterface.controller.updatePageURL(id); }
                }
                if (!BroadcastInterface.hasReachedMax()) {
                    BroadcastInterface.controller.findNewTarget();
                }
            })
        });

        // onError
        broadcast.peer.on("error", err => {
            const pid = String(err).replace("Error: Could not connect to peer ", "");
            BroadcastInterface.removeFromConnections(broadcast, pid);
            if (!broadcast.peer.disconnected) {
                ControllerInterface.findNewTarget(controller);
            }
            ControllerInterface.enableEditor(controller);
        });

        //onDisconnect
        broadcast.peer.on('disconnected', () => {
            ControllerInterface.lostConnection(controller);
        });

        //add to network
        if (targetPeerId === 0) {
            // if targetPeerId is 0, it means that the current peer has no specific target 
            //and should initialize the network.
            ControllerInterface.addToNetwork(controller, id, this.controller.siteId);
        } else {
            // If targetPeerId is not 0,
            // it means the peer is trying to establish a connection with a specific peer 
            //(the one with targetPeerId).
            ControllerInterface.requestConnection(controller, targetPeerId, id, this.controller.siteId)
        }
    })


    // start heartbeat
    let timeoutId = 0;
    const heartbeat = () => {
        timeoutId = setTimeout(heartbeat, 20000);
        if (broadcast.peer.socket._wsOpen()) {
            broadcast.peer.socket.send({ type: 'HEARTBEAT' });
        }
    };

    heartbeat();

    const heartbeatObj = {
        start: function () {
            if (timeoutId === 0) { heartbeat(); }
        },
        stop: function () {
            clearTimeout(timeoutId);
            timeoutId = 0;
        }
    };

    BroadcastInterface.setHeartBeat(broadcast, heartbeatObj)
}