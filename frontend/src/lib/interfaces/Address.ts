import { getAddresBarUrl } from "../address/getUrl";
import { setHost } from "../address/setHost";
import { setPeerId } from "../address/setPeerId";
import { setPort } from "../address/setPort";

export interface Address {
  host: string;
  port: string;
  targetPeerId: string;
  peerId: string;
}

export interface AddressInterface {
  setHost: (address: Address, host: string) => void;
  setPort: (address: Address, port: string) => void;
  setPeerId: (address: Address, peerId: string) => void;
  getAddressBarUrl: (address: Address) => string;
}

export const AddressInterface: AddressInterface = {
  setHost: (...args) => setHost(...args),
  setPort: (...args) => setPort(...args),
  setPeerId: (...args) => setPeerId(...args),
  getAddressBarUrl: (...args) => getAddresBarUrl(...args),
};
