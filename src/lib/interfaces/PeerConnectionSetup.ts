import { Broadcast } from "./Broadcast";
export interface PeerConnectionSetupInterface {
    bindServerEvents(broadcast: Broadcast, targetPeerId: string): void;
    onOpen(broadcast: Broadcast, targetPeerId: string, controller: any, peer: any): void;
    onPeerConnection(broadcast: Broadcast): void;
    onError(broadcast: Broadcast, controller: any): void;
    onDisconnect(broadcast: Broadcast, controller: any): void;
    startPeerHeartBeat(broadcast: Broadcast, peer: any): void;
}