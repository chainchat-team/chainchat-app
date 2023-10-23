import { SetSelectionOperation as SlateSetSelectionOperation } from "slate";

export type SetSelectionOperation = {
    isRemoteOperation?: boolean
} & SlateSetSelectionOperation