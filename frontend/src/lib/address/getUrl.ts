import { Address } from "../interfaces/Address";

export function getAddresBarUrl(address: Address): string {
  if (address.peerId === "") {
    return address.host + ":" + address.port;
  }
  return address.host + ":" + address.port + "/?" + address.targetPeerId;
}
