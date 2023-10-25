import { Descendant } from "../../types/Descendant"
import { Char } from "../interfaces/Char"
import { Version } from "../interfaces/Version"

export type BaseBroadcastEvent = {
    type: string,
    siteId: string,
    peerId: string
}

export type BroadcastSyncRequestEvent = {
    initialStruct: Descendant[],
    // version: Version,
    // network: TBD,
} & BaseBroadcastEvent


export type BroadcastCrdtEvent = {
    char: Char
    version: Version
} & BaseBroadcastEvent


export type BroadcastEvent = BroadcastSyncRequestEvent | BroadcastCrdtEvent
