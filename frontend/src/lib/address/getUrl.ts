import { Address } from "../interfaces/Address";

export function getAddresBarUrl(address: Address): string {
  if (address.peerId === "") {
    return address.origin;
  }
  return address.origin + "/?" + address.targetPeerId;
}
