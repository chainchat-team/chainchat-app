import { RemoveTextOperation as SlateRemoveTextOperation } from "slate";
import { Version } from "../interfaces/Version";

export type RemoveTextOperation = {
    version?: Version
    isRemoteOperation?: boolean
} & SlateRemoveTextOperation