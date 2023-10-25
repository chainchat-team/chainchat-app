import { Descendant } from "../../types/Descendant"
import { Char } from "../interfaces/Char"
import { Version } from "../interfaces/Version"

export type BasePeerEvent = {
    type: string,
    siteId: string,
    peerId: string
}

export type PeerSyncRequestEvent = {
    initialStruct: Descendant[],
    // initialVersions: TBD,
    // network: TBD,
} & BasePeerEvent


export type PeerCrdtEvent = {
    char: Char,
    version: Version
} & BasePeerEvent


export type PeerEvent = PeerSyncRequestEvent | PeerCrdtEvent
