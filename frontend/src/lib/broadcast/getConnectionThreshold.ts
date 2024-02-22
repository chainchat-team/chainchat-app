import { fetchNetwork } from "../events/fetchNetwork";
import { Broadcast } from "../interfaces/Broadcast";

export async function getConnectionThreshold(brodcast: Broadcast): Promise<number> {
    const network = await fetchNetwork()
    const threshold = Math.max(Math.ceil(network.globalPeers.length / 2), 2)
    return threshold
}