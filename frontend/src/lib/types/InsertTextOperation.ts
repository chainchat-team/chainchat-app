import { InsertTextOperation as SlateInsertTextOperation } from "slate";
import { Char } from "../interfaces/Char";

export type InsertTextOperation = {
    isRemoteOperation?: boolean
    char?: Char
} & SlateInsertTextOperation