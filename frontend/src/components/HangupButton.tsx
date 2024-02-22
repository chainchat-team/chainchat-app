import React from "react";
import { eventBus } from "../lib/events/create-eventbus";

interface HangupButtonProps {
  peerId: string;
}

const HangupButton: React.FC<HangupButtonProps> = ({ peerId }) => {
  const onClickHandler = () => {
    eventBus.emit("hangup", peerId);
  };

  return <img src="../assets/images/hangup.png" alt="Call" onClick={onClickHandler} className="phone" />;
};

export default HangupButton;
