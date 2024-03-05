import { Network } from "../interfaces/Network";

export function networkSize(network: Network): number {
    return network.globalPeers.length
}