import { Descendant } from "../../types/Descendant"
import { Char } from "../interfaces/Char"
import { Network } from "../interfaces/Network"
import { Version } from "../interfaces/Version"
import { VersionVector } from "../interfaces/VersionVector"
import { Peer } from "./Peer"

export type BaseBroadcastEvent = {
    type: string,
    siteId: string,
    peerId: string
}

export type BroadcastSyncRequestEvent = {
    initialStruct: Descendant[],
    versionVector: Partial<VersionVector>,
    network: Partial<Network>
} & BaseBroadcastEvent

export type BroadcastForwardRequestEvent = {
    avialablePeer: Peer
} & BaseBroadcastEvent


export type BroadcastCrdtEvent = {
    char: Char
    version: Version
    connectionType: 'out' | 'in'
} & BaseBroadcastEvent


export type BroadcastEvent = BroadcastSyncRequestEvent | BroadcastCrdtEvent
