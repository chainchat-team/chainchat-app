// DataAndVideoCommunication.ts

import { Broadcast } from "./Broadcast";

export interface DataAndVideoCommunicationInterface {
    send(broadcast: Broadcast, operation: any): void;
    addToOutgoingBuffer(broadcast: Broadcast, operation: string): void;
    processOutgoingBuffer(broadcast: Broadcast, peerId: string): void;
    // videoCall(broadcast: Broadcast, id: string, ms: number): void;
    // onVideoCall(broadcast: Broadcast,): void;
    // answerCall(broadcast: Broadcast, callObj: any, ms: number): void;
    // onStream(broadcast: Broadcast, callObj: any): void;
    // onStreamClose(broadcast: Broadcast, peerId: string): void;
    onData(broadcast: Broadcast, connection: any): void;
}

export default DataAndVideoCommunicationInterface;
