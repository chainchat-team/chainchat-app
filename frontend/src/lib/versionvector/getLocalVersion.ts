import { Version } from "../interfaces/Version";
import { VersionVector } from "../interfaces/VersionVector";

export function getLocalVersion(versionVector: VersionVector): Version {
    return {
        peer: versionVector.localVersion.peer,
        counter: versionVector.localVersion.counter
    }
}