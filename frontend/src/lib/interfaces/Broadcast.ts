import { Peer as PeerJs, DataConnection } from "peerjs";
import { addOutGoingConnection } from "../broadcast/addOutGoingConnection";
import { addIncomingConnection } from "../broadcast/addIncomingConnection";
import { handleIncomingConnection } from "../broadcast/connection/handleIncomingConnection";
import { handleOutgoingConnection } from "../broadcast/connection/handleOutgoingConnection";
import { removeOutgoingConnection } from "../broadcast/removeOutgoingConnection";
import { Peer } from "../types/Peer";
import { getIncomingPeer } from "../broadcast/getIncomingPeer";
import { getOutgoingPeer } from "../broadcast/getOutgoingPeer";
import { closeDeadPeers } from "../broadcast/closeDeadPeer";
import { close } from "../broadcast/close";
import { findNewTarget } from "../broadcast/findNewTarget";
import { hasReachedMax } from "../broadcast/hasReachedMax";
import { getAvailablePeer } from "../broadcast/getAvailablePeer";
import { getConnectionThreshold } from "../broadcast/getConnectionThreshold";
import { handleIncomingMediaConnection } from "../broadcast/connection/handleIncomingMediaConnection";
import { handleOutgoingMediaConnection } from "../broadcast/connection/handleOutgoingMediaConnection";
import { Operation } from "slate/dist/interfaces/operation";

export interface Broadcast {
  peer: PeerJs;
  outgoingBuffer: Operation[];
  outgoingConnections: Peer[];
  incomingConnections: Peer[];
  max_buffer_size: number;
  siteId: string;
  _isCloser: boolean;
  targetPeerId: string;
}

export interface BroadcastInterface {
  addOutGoingConnection: (broadcast: Broadcast, peer: Peer) => void;
  addIncomingConnection: (broadcast: Broadcast, peer: Peer) => void;
  removeOutgoingConnection: (broadcast: Broadcast, peer: Peer) => void;
  removeIngoingConnection: (broadcast: Broadcast, peer: Peer) => void;
  getIncomingPeer: (broadcast: Broadcast, connection: DataConnection) => Peer;
  getOutgoingPeer: (broadcast: Broadcast, connection: DataConnection) => Peer;
  handleIncomingConnection: (broadcast: Broadcast, peer: PeerJs) => void;
  handleOutgoingConnection: (broadcast: Broadcast, peer: PeerJs, targetPeerId: string) => void;
  handleIncomingMediaConnection: (broadcast: Broadcast) => void;
  handleOutgoingMediaConnection: (broadcast: Broadcast, targetPeerId: string) => void;
  findNewTarget: (broadcast: Broadcast) => void;
  closeDeadPeers: (broadcast: Broadcast) => void;
  close: (broadcast: Broadcast) => void;

  //forward request
  hasReachedMax: (broadcast: Broadcast) => Promise<boolean>;
  getAvailablePeer: (broadcast: Broadcast) => Promise<Peer | undefined>;
  getConnectionThreshold: (broadcast: Broadcast) => Promise<number>;
}

export const BroadcastInterface: BroadcastInterface = {
  addOutGoingConnection: (...args) => addOutGoingConnection(...args),
  addIncomingConnection: (...args) => addIncomingConnection(...args),
  removeOutgoingConnection: (...args) => removeOutgoingConnection(...args),
  removeIngoingConnection: (...args) => removeOutgoingConnection(...args),
  getIncomingPeer: (...args) => getIncomingPeer(...args),
  getOutgoingPeer: (...args) => getOutgoingPeer(...args),
  handleIncomingConnection: (...args) => handleIncomingConnection(...args),
  handleOutgoingConnection: (...args) => handleOutgoingConnection(...args),
  handleIncomingMediaConnection: (...args) => handleIncomingMediaConnection(...args),
  handleOutgoingMediaConnection: (...args) => handleOutgoingMediaConnection(...args),
  findNewTarget: (...args) => findNewTarget(...args),
  closeDeadPeers: (...args) => closeDeadPeers(...args),
  close: (...args) => close(...args),
  hasReachedMax: (...args) => hasReachedMax(...args),
  getAvailablePeer: (...args) => getAvailablePeer(...args),
  getConnectionThreshold: (...args) => getConnectionThreshold(...args),
};
