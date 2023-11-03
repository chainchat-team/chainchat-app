import { Editor } from "slate";
import { Crdt, CrdtInterface } from "../interfaces/Crdt";
import { VersionVectorInterface } from "../interfaces/VersionVector";

export async function processDeletionBuffer(crdt: Crdt, editor: Editor) {
    const deletionBufferCopy = [...crdt.deletionBuffer];
    const appliedOperationsIdx: number[] = []
    for (let index = 0; index < deletionBufferCopy.length; index++) {
        const operation = deletionBufferCopy[index];
        const charVersion = { siteId: operation.char.siteId, counter: operation.char.counter };

        if (VersionVectorInterface.hasBeenApplied(crdt.versionVector, charVersion)) {
            await CrdtInterface.handleRemoteDelete(crdt, editor, operation.char, operation.version);
            appliedOperationsIdx.push(index)
        }
    }

    // Replace the original buffer with the filtered copy
    crdt.deletionBuffer = deletionBufferCopy.filter((_, index) => !appliedOperationsIdx.includes(index));
}
