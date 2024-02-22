import { Address } from "../interfaces/Address";

export function setPeerId(address: Address, peerId: string) {
    address.peerId = peerId
}