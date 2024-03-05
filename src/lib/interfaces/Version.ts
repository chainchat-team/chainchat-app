import { Peer } from "../types/Peer"
import { update } from "../version/update"

export interface Version {
    peer: Peer,
    counter: number
    exceptions?: number[]
}

export interface VersionInterface {
    update: (version: Version, otherVersion: Version) => Version
}


export const VersionInterface: VersionInterface = {
    update: (...args) => update(...args)
}