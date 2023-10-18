import { Descendant } from "../../types/Descendant"
import { Char } from "../interfaces/Char"

export type BasePeerEvent = {
    type: string,
    siteId: number,
    peerId: string
}

export type PeerSyncRequestEvent = {
    initialStruct: Descendant[],
    // initialVersions: TBD,
    // network: TBD,
} & BasePeerEvent


export type PeerCrdtEvent = {
    char: Char
} & BasePeerEvent


export type PeerEvent = PeerSyncRequestEvent | PeerCrdtEvent
