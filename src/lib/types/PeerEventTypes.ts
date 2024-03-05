import { Descendant } from "../../types/Descendant";
import { Char } from "../interfaces/Char";
import { Network } from "../interfaces/Network";
import { Version } from "../interfaces/Version";
import { VersionVector } from "../interfaces/VersionVector";
import { Peer } from "./Peer";

export type BasePeerEvent = {
  type: string;
  siteId: string;
  peerId: string;
};

export type PeerSyncRequestEvent = {
  initialStruct: Descendant[];
  versionVector: Partial<VersionVector>;
  network: Partial<Network>;
} & BasePeerEvent;

export type PeerForwardRequestEvent = {
  avialablePeer: Peer;
} & BasePeerEvent;

export type PeerNetworkFullEvent = BasePeerEvent;

export type PeerAddToNetworkEvent = {
  peerToBeAdded: Peer;
  networkVersion: Version;
} & BasePeerEvent;

export type PeerRemoveFromNetworkEvent = {
  peerToBeRemoved: Peer;
  networkVersion: Version;
  connectionType: "out" | "in";
} & BasePeerEvent;

export type PeerCrdtEvent = {
  char: Char;
  version: Version;
} & BasePeerEvent;

export type PeerEvent =
  | PeerCrdtEvent
  | PeerRemoveFromNetworkEvent
  | PeerAddToNetworkEvent
  | PeerForwardRequestEvent
  | PeerSyncRequestEvent
  | BasePeerEvent;
