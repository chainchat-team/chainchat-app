import { InsertTextOperation as SlateInsertTextOperation } from "slate";
import { Char } from "../interfaces/Char";
import { Version } from "../interfaces/Version";

export type InsertTextOperation = {
    version?: Version
    isRemoteOperation?: boolean
    char?: Char
} & SlateInsertTextOperation