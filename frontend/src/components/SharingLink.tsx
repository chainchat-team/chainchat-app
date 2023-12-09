import React, { useEffect, useState } from "react";
import { fetchAddress } from "../lib/events/fetchAddress";
import { Address } from "../lib/interfaces/Address";
import { eventBus } from "../lib/events/create-eventbus";

const SharingLink = () => {
  const [address, setAddress] = useState<Address | null>(null);

  useEffect(() => {
    const asyncFetchAddress = async () => {
      const address = await fetchAddress();
      setAddress(address);
    };
    asyncFetchAddress();

    const updateAddressListener = (address: Address) => {
      setAddress({ ...address });
    };
    eventBus.on("updateAddress", updateAddressListener);

    return () => {
      eventBus.off("updateAddress", updateAddressListener);
    };
  }, []);

  const copyToClipboard = () => {
    if (address) {
      navigator.clipboard.writeText(`${address.host}:${address.port}/?${address.peerId}`);
    }
  };

  return (
    <div>
      <p>Sharing Link</p>
      <input type="text" value={address ? `${address.host}:${address.port}/?${address.peerId}` : ""} readOnly />
      <button onClick={copyToClipboard}>Copy to Clipboard</button>
    </div>
  );
};

export default SharingLink;
