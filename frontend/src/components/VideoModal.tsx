import React, { useEffect, useRef, FC } from "react";
import "../style/VideoModal.css";
interface VideoModalProps {
  id: string;
  mediaStream: MediaStream | undefined;
  onClose: () => void;
}

const VideoModal: FC<VideoModalProps> = ({ id, mediaStream, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    console.log("useeffect");
    if (videoRef.current && mediaStream) {
      videoRef.current.srcObject = mediaStream;
    }
  }, []);

  return (
    <div className="modal">
      <div className="modal-content">{mediaStream && <video key={id} ref={videoRef} autoPlay />}</div>
    </div>
  );
};

export default VideoModal;
