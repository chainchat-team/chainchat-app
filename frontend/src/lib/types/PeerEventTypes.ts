import { Descendant } from "../../types/Descendant"
import { Char } from "../interfaces/Char"
import { Network } from "../interfaces/Network"
import { Version } from "../interfaces/Version"
import { Peer } from "./Peer"

export type BasePeerEvent = {
    type: string,
    siteId: string,
    peerId: string
}

export type PeerSyncRequestEvent = {
    initialStruct: Descendant[],
    // initialVersions: TBD,
    network: Partial<Network>,
} & BasePeerEvent

export type PeerAddToNetworkEvent = {
    peerToBeAdded: Peer
} & BasePeerEvent

export type PeerRemoveFromNetworkEvent = {
    peerToBeRemoved: Peer
} & BasePeerEvent




export type PeerCrdtEvent = {
    char: Char,
    version: Version
} & BasePeerEvent


export type PeerEvent = PeerSyncRequestEvent | PeerCrdtEvent | BasePeerEvent
