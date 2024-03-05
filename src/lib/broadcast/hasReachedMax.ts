import { fetchNetwork } from "../events/fetchNetwork";
import { Broadcast, BroadcastInterface } from "../interfaces/Broadcast";
import { Network } from "../interfaces/Network";

export async function hasReachedMax(broadcast: Broadcast): Promise<boolean> {
    const network: Network = await fetchNetwork()
    const threshold = await BroadcastInterface.getConnectionThreshold(broadcast)
    return broadcast.incomingConnections.length > threshold
}