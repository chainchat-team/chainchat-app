import { Descendant } from "../../types/Descendant"
export type SyncRequest = {
    type: string,
    siteId: number,
    peerId: string,
    initialStruct: Descendant[],
    // initialVersions: TBD,
    // network: TBD,
}
