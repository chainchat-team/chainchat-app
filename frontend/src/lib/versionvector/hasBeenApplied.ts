import { Version } from "../interfaces/Version";
import { VersionVector } from "../interfaces/VersionVector";

export function hasBeenApplied(versionVector: VersionVector, version: Version): boolean {
    const localCopy = versionVector.versions.find(item => item.peer.siteId === version.peer.siteId);

    if (localCopy === undefined) {
        return false
    }
    if (!localCopy.exceptions) {
        throw new Error(`Version's exception property is undefined: ${JSON.stringify(localCopy)}`)
    }

    //NOTE: `.counter` refers to operation order
    //if incoming operation has counter smaller than our local copy..it possible that we have applied it
    //to grauantee that we have applied it before, it shouldn't be in the exceptions cache as well
    // NOTE: exceptions cache is where we store unapplied operations that are smaller than what we have seen.
    const isIncomingLower = version.counter <= localCopy.counter
    const isInExceptions = localCopy.exceptions.includes(version.counter)
    return isIncomingLower && !isInExceptions
}