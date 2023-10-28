import { DataConnection } from "peerjs"

export type Peer = {
    peerId: string,
    siteId: string
    connection?: DataConnection
}