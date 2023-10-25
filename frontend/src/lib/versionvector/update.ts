import { Version, VersionInterface } from "../interfaces/Version";
import { VersionVector } from "../interfaces/VersionVector";

export function update(versionVector: VersionVector, version: Version): VersionVector {
    var siteVersion = versionVector.versions.find(item => item.siteId === version.siteId);
    var updatedVersions: Version[];
    if (!siteVersion) {
        siteVersion = VersionInterface.update(
            {
                siteId: version.siteId,
                counter: 0,
                exceptions: []
            }, version);

        updatedVersions = [...versionVector.versions, siteVersion]
    } else {
        updatedVersions = versionVector.versions.map(item => {
            if (item.siteId === version.siteId) {
                return VersionInterface.update(item, version)
            }
            return item
        })
    }
    const updatedVersionVector: VersionVector = { ...versionVector, versions: updatedVersions }
    return updatedVersionVector
}