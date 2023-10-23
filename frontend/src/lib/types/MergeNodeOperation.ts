import { MergeNodeOperation as SlateMergeNodeOperation } from "slate";

export type MergeNodeOperation = {
    isRemoteOperation?: boolean
} & SlateMergeNodeOperation