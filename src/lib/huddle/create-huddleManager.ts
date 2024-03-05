import { eventBus } from "../events/create-eventbus";
import { fetchNetwork } from "../events/fetchNetwork";
import { HuddleManager, HuddleManagerInterface } from "../interfaces/HuddleManager";
import { Network } from "../interfaces/Network";
import { Peer } from "../types/Peer";

export const createHuddleManager = () => {
  let huddleManager: HuddleManager = {
    globalPeers: [],
    activeCalls: [],
    mediaStream: null,
  };
  //initialize globalPeers
  const initGlobalPeers = async () => {
    const network: Network = await fetchNetwork();
    huddleManager.globalPeers = [...network.globalPeers];
  };
  initGlobalPeers();

  //add to huddle and send new updated huddleMangers to subscribers
  eventBus.on("addToActiveCalls", (peer: Peer) => {
    HuddleManagerInterface.addToActiveCalls(huddleManager, peer);
    eventBus.emit("updateHuddleManager", huddleManager);
  });

  //remove from huddle and send new updated huddleManagers to subscribers
  eventBus.on("removeFromActiveCalls", (peer: Peer) => {
    HuddleManagerInterface.removeFromActiveCalls(huddleManager, peer);
    eventBus.emit("updateHuddleManager", huddleManager);
  });

  //sync globalPeers update from network
  eventBus.on("updateNetwork", (networkPayload: Network) => {
    huddleManager = HuddleManagerInterface.syncGlobalPeers(huddleManager, networkPayload.globalPeers);
    //maybe send new updated huddleManger to subscribers
    eventBus.emit("updateHuddleManager", huddleManager);
  });

  //getter for huddle manager
  eventBus.on("requestHuddleManager", () => {
    eventBus.emit("responseHuddleManager", { ...huddleManager });
  });

  eventBus.on("initMediaStream", (mediaStream: MediaStream) => {
    huddleManager.mediaStream = mediaStream;
  });

  eventBus.on("closeLocalMediaStream", () => {
    if (huddleManager.activeCalls.length > 1) {
      return;
    }
    huddleManager.mediaStream?.getTracks().forEach((track) => {
      track.stop();
    });
    huddleManager.mediaStream = null;
  });
};
