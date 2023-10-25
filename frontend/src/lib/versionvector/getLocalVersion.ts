import { Version } from "../interfaces/Version";
import { VersionVector } from "../interfaces/VersionVector";

export function getLocalVersion(versionVector: VersionVector): Version {
    return {
        siteId: versionVector.localVersion.siteId,
        counter: versionVector.localVersion.counter
    }
}