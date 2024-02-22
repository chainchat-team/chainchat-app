import React, { useState, useEffect, FC } from "react";
import { Network } from "../lib/interfaces/Network";
import { Peer } from "../lib/types/Peer";
import { eventBus } from "../lib/events/create-eventbus";
// import "../style/NetworkList.css";
import CallButton from "./CallButton";
import { fetchHuddleManager } from "../lib/events/fetchHuddleManager";
import { HuddleManager } from "../lib/interfaces/HuddleManager";
import HangupButton from "./HangupButton";
import { fetchNetwork } from "../lib/events/fetchNetwork";
import { Avatar } from "../lib/types/Avatar";
import { fetchAvatar } from "../lib/events/fetchAvatar";
import "../css/style.css";

type NetworkListProps = {
  peerId: string | null;
};

const NetworkList: FC<NetworkListProps> = ({ peerId }) => {
  // Use state to manage the network data
  const [network, setNetwork] = useState<Network | null>(null);
  const [huddleManager, setHuddleManager] = useState<HuddleManager | null>(null);
  const comparePeers = (peerA: Peer, peerB: Peer) => {
    if (peerA.peerId < peerB.peerId) {
      return -1;
    }
    if (peerA.peerId > peerB.peerId) {
      return 1;
    }
    return 0;
  };
  useEffect(() => {
    // subscribe to the event bus to receive the network data
    const asyncFetchNetwork = async () => {
      const network = await fetchNetwork();
      setNetwork(network);
    };
    asyncFetchNetwork();

    const updateNetworkListener = (network: Network) => {
      setNetwork({ ...network });
    };
    eventBus.on("updateNetwork", updateNetworkListener);

    //subscribe to the event bus to receive the huddle manager data
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
      eventBus.off("updateNetwork", updateNetworkListener);
    };
  }, []);

  const isInActiveCall = (peer: Peer) => {
    if (huddleManager !== null) {
      return huddleManager.activeCalls.some((call) => call.peerId === peer.peerId);
    }
    return false;
  };
  return (
    <div id="peerId">
      {network !== null ? (
        <>
          <div className="peer">
            Peers:
            <span>-{peerId}</span>
            <ul>
              {network.globalPeers.sort(comparePeers).map((peer, index) => (
                <li key={index}>
                  <span style={{ backgroundColor: peer.avatar?.color }}>
                    {peer.avatar ? peer.avatar.animal : peer.peerId}
                  </span>
                  {peer.peerId === peerId ? (
                    " (You)"
                  ) : !isInActiveCall(peer) ? (
                    <CallButton key={peer.peerId} peerId={peer.peerId} />
                  ) : (
                    <HangupButton key={peer.peerId} peerId={peer.peerId} />
                  )}
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <p>No network available</p>
      )}
    </div>
  );
};

export default NetworkList;
