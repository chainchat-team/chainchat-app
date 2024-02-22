import React, { useState, useEffect } from "react";
import { eventBus } from "../lib/events/create-eventbus";
import { Peer } from "../lib/types/Peer";
import "../css/style.css";

type PropType = {
  peerId: string;
};

const CallButton = ({ peerId }: PropType) => {
  const [selectedPeerId, setSelectedPeerId] = useState(peerId);
  const [isCalling, setIsCalling] = useState(false);

  const onClickHandler = () => {
    if (selectedPeerId.length < 1) {
      throw new Error("Invalid peer id.");
    }
    eventBus.emit("call", selectedPeerId);
    setIsCalling(true);
  };

  return <img src="../assets/images/call.png" alt="Call" onClick={onClickHandler} className="phone" />;
};

export default CallButton;
