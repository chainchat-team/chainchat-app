import { DataConnection, MediaConnection } from "peerjs";

export type Peer = {
  peerId: string;
  siteId: string;
  connection?: DataConnection;
  mediaConnection?: MediaConnection;
  mediaStream?: MediaStream;
};
