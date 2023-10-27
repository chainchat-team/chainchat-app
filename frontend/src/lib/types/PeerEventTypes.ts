import { Descendant } from "../../types/Descendant"
import { Char } from "../interfaces/Char"
import { Network } from "../interfaces/Network"
import { Version } from "../interfaces/Version"

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


export type PeerCrdtEvent = {
    char: Char,
    version: Version
} & BasePeerEvent


export type PeerEvent = PeerSyncRequestEvent | PeerCrdtEvent | BasePeerEvent
