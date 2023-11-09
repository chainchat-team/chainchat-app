import { Version, VersionInterface } from "../interfaces/Version";
import { VersionVector } from "../interfaces/VersionVector";

export function update(versionVector: VersionVector, version: Version): VersionVector {
    var siteVersion = versionVector.versions.find(item => item.peer.siteId === version.peer.siteId);
    var updatedVersions: Version[];
    if (!siteVersion) {
        siteVersion = VersionInterface.update(
            {
                peer: version.peer,
                counter: 0,
                exceptions: []
            }, version);

        updatedVersions = [...versionVector.versions, siteVersion]
    } else {
        updatedVersions = versionVector.versions.map(item => {
            if (item.peer.siteId === version.peer.siteId) {
                return VersionInterface.update(item, version)
            }
            return item
        })
    }
    const updatedVersionVector: VersionVector = { ...versionVector, versions: updatedVersions }
    return updatedVersionVector
}