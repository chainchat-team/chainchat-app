import { MergeNodeOperation as SlateMergeNodeOperation } from "slate";
import { Version } from "../interfaces/Version";

export type MergeNodeOperation = {
    version?: Version
    isRemoteOperation?: boolean
} & SlateMergeNodeOperation