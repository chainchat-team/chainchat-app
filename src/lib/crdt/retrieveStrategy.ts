import { Crdt } from "../interfaces/Crdt"

export function retrieveStrategy(crdt: Crdt, level: number): boolean {
    const strategy = crdt.strategyCache.length - 1 <= level ? crdt.strategyCache[level] : Math.random() >= 0.5
    crdt.strategyCache[level] = strategy
    return strategy
}