import { RemoveTextOperation as SlateRemoveTextOperation } from "slate";

export type RemoveTextOperation = {
    isRemoteOperation?: boolean
} & SlateRemoveTextOperation