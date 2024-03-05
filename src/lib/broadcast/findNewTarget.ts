import { eventBus } from "../events/create-eventbus";
import { Broadcast, BroadcastInterface } from "../interfaces/Broadcast";
import { Network } from "../interfaces/Network";

export function findNewTarget(broadcast: Broadcast) {
  // find the peer that are not directly connected to you.
  // the question is how are we going to get the
  // I guess we can request for current network list... and do things that way...
  const responseNetworkListener = (network: Network) => {
    const allConnectedPeers: string[] = [
      ...broadcast.incomingConnections.map((item) => item.peerId),
      ...broadcast.outgoingConnections.map((item) => item.peerId),
      broadcast.peer.id,
    ];

    const possibleTargets = network.globalPeers.filter((item) => !allConnectedPeers.includes(item.peerId));

    if (possibleTargets.length === 0) {
      // const changeUrlOnConnectionListener = (connection: DataConnection) => {
      //     const newUrl = `${location.host}/?${connection.peer}`
      //     window.history.pushState({}, newUrl)
      //     broadcast.peer.off('connection', changeUrlOnConnectionListener)
      // }
      // broadcast.peer.on('connection', changeUrlOnConnectionListener)
    } else {
      const randomIdx = Math.floor(Math.random() * possibleTargets.length);
      const newTarget = possibleTargets[randomIdx].peerId;

      if (newTarget < broadcast.peer.id) {
        BroadcastInterface.handleOutgoingConnection(broadcast, broadcast.peer, newTarget);
      }
    }
    eventBus.off("responseNetwork", responseNetworkListener);
  };
  eventBus.on("responseNetwork", responseNetworkListener);

  eventBus.emit("requestNetwork");
}
