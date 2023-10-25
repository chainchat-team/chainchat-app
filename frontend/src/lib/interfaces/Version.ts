import { update } from "../version/update"

export interface Version {
    siteId: string
    counter: number
    exceptions?: number[]
}

export interface VersionInterface {
    update: (version: Version, otherVersion: Version) => Version
}


export const VersionInterface: VersionInterface = {
    update: (...args) => update(...args)
}