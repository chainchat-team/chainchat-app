// NetworkManagement.ts

import { Broadcast } from "./Broadcast";

export interface NetworkManagementInterface {
    addToNetwork(broadcast: Broadcast, peerId: string, siteId: string): void;
    removeFromNetwork(broadcast: Broadcast, peerId: string): void;
    removeFromConnections(broadcast: Broadcast, peer: string): void;
    evaluateRequest(broadcast: Broadcast, peerId: string, siteId: string): void;
    hasReachedMax(broadcast: Broadcast): boolean;
    forwardConnRequest(broadcast: Broadcast, peerId: string, siteId: string): void;
}

export default NetworkManagementInterface;
