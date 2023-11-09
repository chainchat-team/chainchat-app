import { Address } from "../interfaces/Address";

export function getUrl(address: Address): string {
    if (address.peerId === '') {
        return address.host + ':' + address.port
    }
    return address.host + ':' + address.port + '/?' + address.peerId
}