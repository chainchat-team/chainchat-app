import { SplitNodeOperation as SlateSplitNodeOperation } from "slate";
import { Char } from "../interfaces/Char";
import { Version } from "../interfaces/Version";

export type SplitNodeOperation = {
    version?: Version
    isRemoteOperation?: boolean
    char?: Char
} & SlateSplitNodeOperation