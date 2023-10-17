import { BaseOperation } from "slate"

export type BroadcastOperation = {
    type: string,
    operations: BaseOperation[]
}