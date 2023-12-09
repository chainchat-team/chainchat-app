import React, { useState, useEffect } from "react";
import { eventBus } from "../lib/events/create-eventbus";
import { Peer } from "../lib/types/Peer";

type PropType = {
  peerId: string;
};

const CallButton = ({ peerId }: PropType) => {
  const [selectedPeerId, setSelectedPeerId] = useState(peerId);

  const onClickHandler = () => {
    if (selectedPeerId.length < 1) {
      throw new Error("Invalid peer id.");
    }
    eventBus.emit("call", selectedPeerId);
  };

  return (
    <div>
      <button onClick={onClickHandler}>Call</button>
    </div>
  );
};

export default CallButton;
