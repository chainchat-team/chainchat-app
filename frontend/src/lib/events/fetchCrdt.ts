import { Crdt } from "../interfaces/Crdt"
import { eventBus } from "./create-eventbus"

export function fetchCrdt(): Promise<Crdt> {
    return new Promise((resolve, reject) => {
        const responseCrdtListener = (crdt: Crdt) => {
            eventBus.off('responseCrdt', responseCrdtListener)
            resolve(crdt)
        }
        eventBus.on('responseCrdt', responseCrdtListener)
        eventBus.emit('requestCrdt')
    })
}