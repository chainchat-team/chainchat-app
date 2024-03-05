import { DataConnection, MediaConnection } from "peerjs";
import { Avatar } from "./Avatar";
import { Range } from "slate";

export type Peer = {
  peerId: string;
  siteId: string;
  connection?: DataConnection;
  mediaConnection?: MediaConnection;
  mediaStream?: MediaStream;
  avatar?: Avatar;
  cursor?: Range;
};
