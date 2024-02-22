import React, { useEffect, useRef, FC } from "react";
import "../css/style.css";
import { X, Minus } from "react-feather";
import Draggable from "react-draggable";
import { eventBus } from "../lib/events/create-eventbus";
import { Avatar } from "../lib/types/Avatar";
import { Peer } from "../lib/types/Peer";

const Draggable1: any = Draggable;
interface VideoModalProps {
  peer: Peer;
  mediaStream: MediaStream | undefined;
  onClose: () => void;
}

const VideoModal: FC<VideoModalProps> = ({ peer, mediaStream, onClose }) => {
  const nodeRef = React.useRef(null);
  const [isMinimized, setIsMinimized] = React.useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (videoRef.current && mediaStream) {
      videoRef.current.srcObject = mediaStream;
    }
  }, []);

  const handleMinimizeClick = () => {
    setIsMinimized(!isMinimized);
  };

  const hangUpHandler = () => {
    eventBus.emit("hangup", peer.peerId);
  };

  return (
    <Draggable1 nodeRef={nodeRef}>
      <div className={`video-modal ${isMinimized ? "mini" : ""}`} ref={nodeRef}>
        <div className="video-bar" style={{ backgroundColor: peer.avatar!.color }}>
          <Minus className="minimize" onClick={handleMinimizeClick} />
          {peer.avatar?.animal}
          <X className="exit" onClick={hangUpHandler} />
        </div>
        {mediaStream && <video key={peer.peerId} ref={videoRef} className={isMinimized ? "hide" : ""} autoPlay />}
      </div>
    </Draggable1>
  );
};

export default VideoModal;
