import React, { useEffect, useState } from "react";
import { fetchAddress } from "../lib/events/fetchAddress";
import { Address } from "../lib/interfaces/Address";
import { eventBus } from "../lib/events/create-eventbus";
import { Copy } from "react-feather";
import "../css/style.css";

const SharingLink = () => {
  const [copied, setCopied] = useState(false);
  const [link, setLink] = useState("");

  useEffect(() => {
    const asyncSetLink = async () => {
      const address = await fetchAddress();
      setLink(`${address.host}:${address.port}/?${address.peerId}`);
    };
    asyncSetLink();

    const updateLinkListener = (address: Address) => {
      setLink(`${address.host}:${address.port}/?${address.peerId}`);
    };
    eventBus.on("updateAddress", updateLinkListener);

    return () => {
      eventBus.off("updateAddress", updateLinkListener);
    };
  }, []);

  const copyToClipboard = () => {
    if (link.length > 0) {
      navigator.clipboard.writeText(link);
    }
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  return (
    <p className="sharing-link">
      {/* Sharing link */}
      <a href={link} id="myLink" target="_blank" rel="noopener noreferrer" className="link">
        Sharing Link
      </a>
      {/* Place holder span */}
      <span id="myLinkInput" className="aside disappear"></span>
      <span className="copy-container" data-tooltip="Copy to Clipboard" onClick={copyToClipboard}>
        <Copy className="copy-link" color="rgb(17, 117, 232)" />
      </span>
      <span className={`copy-status ${copied ? "copied" : ""}`}>Copied!</span>
    </p>
  );
};

export default SharingLink;
