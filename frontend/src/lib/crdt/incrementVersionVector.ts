import { Crdt } from "../interfaces/Crdt";
import { VersionVectorInterface } from "../interfaces/VersionVector";

export function incrementVersionVector(crdt: Crdt) {
    const newVersionVector = VersionVectorInterface.increment(crdt.versionVector)
    crdt.versionVector = newVersionVector
}