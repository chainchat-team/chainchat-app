import { SetSelectionOperation as SlateSetSelectionOperation } from "slate";
import { Version } from "../interfaces/Version";

export type SetSelectionOperation = {
    version?: Version
    isRemoteOperation?: boolean
} & SlateSetSelectionOperation