import { Peer as PeerJs, MediaConnection } from "peerjs";
import { Broadcast } from "../../interfaces/Broadcast";
import { eventBus } from "../../events/create-eventbus";
import { fetchNetwork } from "../../events/fetchNetwork";
import { Network } from "../../interfaces/Network";
import { fetchHuddleManager } from "../../events/fetchHuddleManager";

export function handleIncomingMediaConnection(broadcast: Broadcast) {
  broadcast.peer.on("call", async (connection: MediaConnection) => {
    const huddleManager = await fetchHuddleManager();
    let mediaStream: MediaStream;
    if (huddleManager.mediaStream) {
      mediaStream = huddleManager.mediaStream;
    } else {
      mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      eventBus.emit("initMediaStream", mediaStream);
    }
    // const mediaStream: MediaStream = await navigator.mediaDevices.getUserMedia({ audio: false, video: true });
    connection.answer(mediaStream);
    connection.on("stream", async (remoteMediaStream: MediaStream) => {
      //add video element
      // we need to get gett
      const network: Network = await fetchNetwork();

      console.log("from handleIncomingMediaConnection:");
      console.log(connection.peer);
      const targetPeer = network.globalPeers.find((item) => item.peerId === connection.peer);
      if (!targetPeer) {
        throw Error(
          `Failed to handle incoming media request. Could not find traget peer in network with peerId ${connection.peer}`
        );
      }
      eventBus.emit("addToActiveCalls", { ...targetPeer, mediaConnection: connection, mediaStream: remoteMediaStream });

      eventBus.on("hangup", (peerId) => {
        if (peerId !== connection.peer) return;
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
  });
}
