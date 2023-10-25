import { VersionVector } from "../interfaces/VersionVector";

export function increment(versionVector: VersionVector): VersionVector {
    const updatedLocalVersion = {
        ...versionVector.localVersion,
        counter: versionVector.localVersion.counter + 1
    }
    const updatedVersions = versionVector.versions.map(item => {
        if (item.siteId === versionVector.localVersion.siteId) {
            return updatedLocalVersion
        }
        return item
    })
    return {
        ...versionVector,
        versions: updatedVersions,
        localVersion: updatedLocalVersion
    }
}