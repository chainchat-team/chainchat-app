import React from "react";
import { eventBus } from "../lib/events/create-eventbus";

interface HangupButtonProps {
  peerId: string;
}

const HangupButton: React.FC<HangupButtonProps> = ({ peerId }) => {
  const handleClick = () => {
    eventBus.emit("hangup", peerId);
  };

  return <button onClick={handleClick}>Hang Up</button>;
};

export default HangupButton;
