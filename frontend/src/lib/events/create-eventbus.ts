import mitt, { Emitter } from "mitt";
import { Descendant } from "../../types/Descendant";
import { BroadcastCrdtEvent, BroadcastSyncRequestEvent } from "../types/BroadcastEventTypes";
import { BroadcastOperation } from "../../types/BroadcastOperation";
import { Peer } from "../types/Peer";
import { Network } from "../interfaces/Network";
import { VersionVector } from "../interfaces/VersionVector";
import { Version } from "../interfaces/Version";
import { Crdt } from "../interfaces/Crdt";
import { HuddleManager } from "../interfaces/HuddleManager";
import { Address } from "../interfaces/Address";
import { Avatar } from "../types/Avatar";
import { BasePoint, Point } from "slate";
type Events = {
  //crdt -> broadcast
  responseVersionVector: Partial<VersionVector>;
  //broadcast -> controller
  updateControllerUrlid: string;
  request_initial_struct: void;
  response_initial_struct: Descendant[];
  handleSyncRequest: BroadcastSyncRequestEvent;
  //broadcast -> crdt
  requestVersionVector: void;
  //boradcast -> huddleManager
  initMediaStream: MediaStream;
  closeLocalMediaStream: void;

  //broadcast -> components
  peerId: string;
  handleRemoteOperation: BroadcastCrdtEvent;

  //broadcast -> network
  addToNetwork: { peerToBeAdded: Peer; peerSender: Peer; networkVersion: Version };
  removeFromNetwork: { peerToBeRemoved: Peer; peerSender: Peer; networkVersion: Version; connectionType: "in" | "out" };
  requestNetwork: void;
  initNetwork: Network;
  requestNetworkVersionVector: void;
  responseNetworkVersionVector: VersionVector;

  //network -> broadcast
  broadcastAddToNetwork: { peerToBeAdded: Peer; peerSender: Peer; networkVersion: Version };
  broadcastRemoveFromNetwork: {
    peerToBeRemoved: Peer;
    peerSender: Peer;
    networkVersion: Version;
    connectionType: "in" | "out";
  };
  responseNetwork: Network;
  incrementVersionVector: void;
  responseIncrementVersionVector: void;

  //huddleManager -> everything eles
  requestHuddleManager: void;
  responseHuddleManager: HuddleManager;
  addToActiveCalls: Peer;
  removeFromActiveCalls: Peer;
  updateHuddleManager: HuddleManager;

  //crdt -> everything else
  requestCrdt: void;
  responseCrdt: Crdt;

  //editor -> everything else
  requestEditorDescendant: void;
  responseEditorDescendant: Descendant[];

  //contoller -> editor
  editorInitialValue: Descendant[];
  enableEditor: boolean;

  //editor -> broadcast
  insert: BroadcastCrdtEvent;
  delete: BroadcastCrdtEvent;

  //call component -> broadcast
  call: string;

  //hangup component -> broadcast
  hangup: string;

  //peerjs -> everything
  peer: Peer;

  //for updateing page
  updateUrl: string;
  // for testing
  requestCurrentTarget: void;
  responseCurrentTarget: Peer | null;
  initNetworkComplete: Network;
  requestPeerConnectionsCount: void;
  responsePeerConnectionsCount: { [key: string]: number };
  updateNetwork: Network;

  // get sharing link
  requestAddress: void;
  responseAddress: Address;
  updateAddress: Address;

  //get avatar
  requestAvatar: string;
  responseAvatar: Avatar;

  //editor statistics
  updateEditorStatistics: { totalLines: number; totalWords: number; cursorPoint: BasePoint | undefined };
};
export const eventBus: Emitter<Events> = mitt<Events>();
