import {
    RemoveTextOperation as SlateRemoveTextOperation,
    MergeNodeOperation as SlateMergeNodeOperation,
    SplitNodeOperation as SlateSplitNodeOperation,
    RemoveNodeOperation as SlateRemoveNodeOperation,
    SetSelectionOperation as SlateSetSelectionOperation,
    InsertTextOperation as SlateInsertTextOperation,
    NodeOperation as SalteNodeOperation
} from "slate";
import { Version } from "../interfaces/Version";
import { Char } from "../interfaces/Char";

export type InsertTextOperation = {
    version?: Version
    isRemoteOperation?: boolean
    char?: Char
} & SlateInsertTextOperation

export type RemoveTextOperation = {
    version?: Version
    isRemoteOperation?: boolean
} & SlateRemoveTextOperation

export type MergeNodeOperation = {
    version?: Version
    isRemoteOperation?: boolean
} & SlateMergeNodeOperation

export type RemoveNodeOperation = {
    version?: Version
    isRemoteOperation?: boolean
} & SlateRemoveNodeOperation


export type SplitNodeOperation = {
    version?: Version
    isRemoteOperation?: boolean
    char?: Char
} & SlateSplitNodeOperation

export type SetSelectionOperation = {
    version?: Version
    isRemoteOperation?: boolean
} & SlateSetSelectionOperation


export type TextOperation = InsertTextOperation | RemoveTextOperation
export type NodeOperation = SplitNodeOperation | MergeNodeOperation | RemoveNodeOperation | SalteNodeOperation
export type CustomOperation = InsertTextOperation | RemoveTextOperation | SplitNodeOperation | MergeNodeOperation | RemoveNodeOperation