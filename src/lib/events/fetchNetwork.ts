import { Network } from "../interfaces/Network"
import { eventBus } from "./create-eventbus"

export function fetchNetwork(): Promise<Network> {
    return new Promise((resolve, reject) => {
        const responseNetworkListener = (networkPayload: Network) => {
            eventBus.off('responseNetwork', responseNetworkListener)
            resolve(networkPayload)
        }
        eventBus.on('responseNetwork', responseNetworkListener)
        eventBus.emit('requestNetwork')
    })
}