import { MediaConnection } from "peerjs";
import { Broadcast } from "../../interfaces/Broadcast";
import { eventBus } from "../../events/create-eventbus";
import { fetchNetwork } from "../../events/fetchNetwork";
import { fetchHuddleManager } from "../../events/fetchHuddleManager";
import { Network } from "../../interfaces/Network";

export async function handleOutgoingMediaConnection(broadcast: Broadcast, targetPeerId: string) {
  // fetch the peer with the target peer Id
  const network = await fetchNetwork();
  const targetPeer = network.globalPeers.find((item) => item.peerId === targetPeerId);
  if (targetPeer === undefined) {
    throw new Error(`Target peer is not found in the network ${targetPeerId}`);
  }

  //check if the targetPeer is already in active calls list
  const huddleManager = await fetchHuddleManager();
  const isInActiveCall = huddleManager.activeCalls.find((item) => item.peerId === targetPeerId);
  if (isInActiveCall) {
    return;
  }

  //check if we are making call to ourself
  if (targetPeerId === broadcast.peer.id) {
    return;
  }

  let mediaStream: MediaStream;
  if (huddleManager.mediaStream) {
    mediaStream = huddleManager.mediaStream;
  } else {
    mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    eventBus.emit("initMediaStream", mediaStream);
  }
  eventBus.emit("initMediaStream", mediaStream);
  const connection: MediaConnection = broadcast.peer.call(targetPeer.peerId, mediaStream);
  connection.on("stream", (remoteMediaStream: MediaStream) => {
    eventBus.emit("addToActiveCalls", { ...targetPeer, mediaConnection: connection, mediaStream: remoteMediaStream });
    eventBus.on("hangup", (peerId) => {
      if (peerId !== targetPeerId) return;
      connection.close();
      eventBus.emit("removeFromActiveCalls", {
        ...targetPeer,
        mediaConnection: connection,
        mediaStream: remoteMediaStream,
      });
    });
  });

  connection.on("close", async () => {
    const network: Network = await fetchNetwork();
    const targetPeer = network.globalPeers.find((item) => item.peerId === connection.peer);
    if (!targetPeer) {
      throw Error(
        `Failed to close media connection. Could not find traget peer in network with peerId ${connection.peer}`
      );
    }
    eventBus.emit("removeFromActiveCalls", {
      ...targetPeer,
      mediaConnection: connection,
    });
    eventBus.emit("closeLocalMediaStream");
  });
}
