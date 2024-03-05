import { Address } from "../interfaces/Address";
import { eventBus } from "./create-eventbus";

export function fetchAddress(): Promise<Address> {
  return new Promise((resolve, reject) => {
    const responseAddressListener = (addressPayload: Address) => {
      eventBus.off("responseAddress", responseAddressListener);
      resolve(addressPayload);
    };
    eventBus.on("responseAddress", responseAddressListener);
    eventBus.emit("requestAddress");
  });
}
