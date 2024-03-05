import { getLocalVersion } from "../versionvector/getLocalVersion";
import { hasBeenApplied } from "../versionvector/hasBeenApplied";
import { increment } from "../versionvector/increment";
import { update } from "../versionvector/update";
import { Version } from "./Version";

export interface VersionVector {
    versions: Version[]
    localVersion: Version
}

export interface VersionVectorInterface {
    increment: (versionVector: VersionVector) => VersionVector,
    update: (versionVector: VersionVector, version: Version) => VersionVector,
    hasBeenApplied: (versionVector: VersionVector, version: Version) => boolean,
    getLocalVersion: (versionVector: VersionVector) => Version
}


export const VersionVectorInterface: VersionVectorInterface = {
    increment: (...args) => increment(...args),
    update: (...args) => update(...args),
    hasBeenApplied: (...args) => hasBeenApplied(...args),
    getLocalVersion: (...args) => getLocalVersion(...args)
}