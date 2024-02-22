import { DataConnection, MediaConnection } from "peerjs";
import { Avatar } from "./Avatar";

export type Peer = {
  peerId: string;
  siteId: string;
  connection?: DataConnection;
  mediaConnection?: MediaConnection;
  mediaStream?: MediaStream;
  avatar?: Avatar;
};
