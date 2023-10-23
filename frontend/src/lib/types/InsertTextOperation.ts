import { InsertTextOperation as SlateInsertTextOperation } from "slate";

export type InsertTextOperation = {
    isRemoteOperation?: boolean
} & SlateInsertTextOperation