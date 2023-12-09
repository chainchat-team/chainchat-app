import { HuddleManager } from "../interfaces/HuddleManager";
import { Peer } from "../types/Peer";

export function addToActiveCalls(huddleManger: HuddleManager, peer: Peer): boolean {
  const isInActiveCall = huddleManger.activeCalls.find((item) => item.peerId === peer.peerId);
  if (isInActiveCall) {
    return false;
  }
  huddleManger.activeCalls = [...huddleManger.activeCalls, peer];
  return true;
}
