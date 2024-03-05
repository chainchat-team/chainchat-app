import { HuddleManager } from "../interfaces/HuddleManager";
import { Peer } from "../types/Peer";

export function syncGlobalPeers(huddleManager: HuddleManager, globalPeersPayload: Peer[]): HuddleManager {
  const newHuddleManager: HuddleManager = { ...huddleManager };
  newHuddleManager.globalPeers = [...globalPeersPayload];
  const globalPeerIds: string[] = newHuddleManager.globalPeers.map((item) => item.peerId);
  const activeCalls: Peer[] = newHuddleManager.activeCalls.filter((item) => globalPeerIds.includes(item.peerId));
  newHuddleManager.activeCalls = [...activeCalls];
  return newHuddleManager;
}
