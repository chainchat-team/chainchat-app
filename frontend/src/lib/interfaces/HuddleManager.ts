import { addToActiveCalls } from "../huddle/addToActiveCalls";
import { removeFromActiveCalls } from "../huddle/removeFromActiveCalls";
import { syncGlobalPeers } from "../huddle/syncGlobalPeers";
import { Peer } from "../types/Peer";

export interface HuddleManager {
  globalPeers: Peer[];
  activeCalls: Peer[];
  mediaStream: MediaStream | null;
}

export interface HuddleManagerInterface {
  addToActiveCalls: (huddleManager: HuddleManager, peer: Peer) => boolean;
  removeFromActiveCalls: (huddleManager: HuddleManager, peer: Partial<Peer>) => boolean;
  syncGlobalPeers: (huddleManager: HuddleManager, globalPeers: Peer[]) => HuddleManager;
}

export const HuddleManagerInterface: HuddleManagerInterface = {
  addToActiveCalls: (...args) => addToActiveCalls(...args),
  removeFromActiveCalls: (...args) => removeFromActiveCalls(...args),
  syncGlobalPeers: (...args) => syncGlobalPeers(...args),
};
