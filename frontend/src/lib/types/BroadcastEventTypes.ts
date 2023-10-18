import { Descendant } from "../../types/Descendant"
import { Char } from "../interfaces/Char"

export type BaseBroadcastEvent = {
    type: string,
    siteId: number,
    peerId: string
}

export type BroadcastSyncRequestEvent = {
    initialStruct: Descendant[],
    // initialVersions: TBD,
    // network: TBD,
} & BaseBroadcastEvent


export type BroadcastCrdtEvent = {
    char: Char
} & BaseBroadcastEvent


export type BroadcastEvent = BroadcastSyncRequestEvent | BroadcastCrdtEvent
