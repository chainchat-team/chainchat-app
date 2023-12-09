import React, { useState, useEffect, FC } from "react";
import { HuddleManager } from "../lib/interfaces/HuddleManager";
import { fetchHuddleManager } from "../lib/events/fetchHuddleManager";
import { eventBus } from "../lib/events/create-eventbus";
import VideoModal from "./VideoModal";

interface HuddleProps {
  peerId: string | null;
}

const Huddle: FC<HuddleProps> = ({ peerId }) => {
  const [huddleManager, setHuddleManager] = useState<HuddleManager | null>(null);
  useEffect(() => {
    const asyncFetchHuddleManager = async () => {
      const huddleManager = await fetchHuddleManager();
      setHuddleManager(huddleManager);
    };
    asyncFetchHuddleManager();

    const updateHuddleManagerListener = (huddleManager: HuddleManager) => {
      setHuddleManager({ ...huddleManager });
    };
    eventBus.on("updateHuddleManager", updateHuddleManagerListener);

    return () => {
      eventBus.off("updateHuddleManager", updateHuddleManagerListener);
    };
  }, []);
  console.log(`From huddle, huddle manager:`);
  console.log(huddleManager);
  return (
    <div>
      {huddleManager !== null ? (
        <>
          {huddleManager.activeCalls
            .filter((peer) => peer.peerId !== peerId)
            .map((peer) => (
              <>
                <VideoModal
                  key={peer.peerId}
                  id={peer.peerId}
                  mediaStream={peer.mediaStream} // Use specific media stream for each call
                  onClose={() => {
                    throw Error("onClose not implemented");
                  }}
                />
                <p key={`modalText_${peer.peerId}`}> Vido Modal: {peer.peerId}</p>
              </>
            ))}
        </>
      ) : (
        <span>Huddle Manager is Null</span>
      )}
    </div>
  );
};
export default Huddle;
