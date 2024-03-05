import { getAddresBarUrl } from "../address/getUrl";
import { setOrigin } from "../address/setOrigin";
import { setPeerId } from "../address/setPeerId";

export interface Address {
  origin: string;
  targetPeerId: string;
  peerId: string;
}

export interface AddressInterface {
  setOrigin: (address: Address, origin: string) => void;
  setPeerId: (address: Address, peerId: string) => void;
  getAddressBarUrl: (address: Address) => string;
}

export const AddressInterface: AddressInterface = {
  setOrigin: (...args) => setOrigin(...args),
  setPeerId: (...args) => setPeerId(...args),
  getAddressBarUrl: (...args) => getAddresBarUrl(...args),
};
