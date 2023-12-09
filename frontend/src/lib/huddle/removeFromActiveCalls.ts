import { HuddleManager } from "../interfaces/HuddleManager";
import { Peer } from "../types/Peer";

export function removeFromActiveCalls(huddleManger: HuddleManager, partialPeer: Partial<Peer>): boolean {
  const peer = huddleManger.activeCalls.find((item) => item.peerId === partialPeer.peerId);
  if (peer === undefined) {
    return false;
  }

  const index = huddleManger.activeCalls.indexOf(peer);
  if (index < 0) {
    return false;
  }
  huddleManger.activeCalls = [
    ...huddleManger.activeCalls.slice(0, index),
    ...huddleManger.activeCalls.slice(index + 1),
  ];
  return true;
}
