import { Broadcast } from "./Broadcast";
import { DataConnection } from "peerjs";

export interface PeerConnectionManagementInterface {
    requestConnection: (broadcast: Broadcast, target: string, peerId: string, siteId: string, peer: DataConnection, addToOutConns: Function) => void
    acceptConnRequest: (broadcast: Broadcast, peerId: string, siteId: string) => void
    addToOutConns: (broadcast: Broadcast, connection: DataConnection) => void
    addToInConns: (broadcast: Broadcast, connection: DataConnection) => void
    onConnClose: (broadcast: Broadcast, connection: DataConnection) => void
    isAlreadyConnectedOut: (broadcast: Broadcast, connection: DataConnection) => boolean
    isAlreadyConnectedIn: (broadcast: Broadcast, connection: DataConnection) => boolean
    onData: (broadcast: Broadcast, connection: DataConnection) => void
    onConnection: (broadcast: Broadcast, connection: DataConnection) => void
}

export const PeerConnectionManagementInterface: PeerConnectionManagementInterface = {
    requestConnection: (...args) => { },
    acceptConnRequest: (...args) => { },
    addToOutConns: (...args) => { },
    addToInConns: (...args) => { },
    onConnClose: (...args) => { },
    isAlreadyConnectedOut: (...args) => true,
    isAlreadyConnectedIn: (...args) => false,
    onData: (...args) => { },
    onConnection: (...args) => { },
}
