import { Crdt } from "../interfaces/Crdt";
import { VersionVector } from "../interfaces/VersionVector";

export function setVersionVector(crdt: Crdt, versionVector: VersionVector) {
    crdt.versionVector = versionVector
}