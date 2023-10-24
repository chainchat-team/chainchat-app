import { SplitNodeOperation as SlateSplitNodeOperation } from "slate";
import { Char } from "../interfaces/Char";

export type SplitNodeOperation = {
    isRemoteOperation?: boolean
    char?: Char
} & SlateSplitNodeOperation