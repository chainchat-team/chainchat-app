import { Address } from "../interfaces/Address";

export function setOrigin(address: Address, origin: string) {
  address.origin = origin;
}
