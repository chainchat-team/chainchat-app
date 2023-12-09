import React, { useState, useEffect } from "react";
import { Network } from "../lib/interfaces/Network";
import { Peer } from "../lib/types/Peer";
import { eventBus } from "../lib/events/create-eventbus";
import "../style/NetworkList.css";
import CallButton from "./CallButton";
import { fetchHuddleManager } from "../lib/events/fetchHuddleManager";
import { HuddleManager } from "../lib/interfaces/HuddleManager";
import HangupButton from "./HangupButton";

const NetworkList = () => {
  // Use state to manage the network data
  const [network, setNetwork] = useState<Network | null>(null);
  const [huddleManager, setHuddleManager] = useState<HuddleManager | null>(null);
  const [targetPeer, setTargetPeer] = useState<Peer | null>();
  const [peerID, setPeerId] = useState<string>("");
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
    const peerIdListener = (id: string) => {
      setPeerId(id);
    };
    eventBus.on("peerId", peerIdListener);

    // subscribe to the event bus to receive the network data
    const fetchNetwork = () => {
      const responseNetworkListener = (network: Network) => {
        setNetwork(network);
        eventBus.off("responseNetwork", responseNetworkListener);
      };
      eventBus.on("responseNetwork", responseNetworkListener);
      eventBus.emit("requestNetwork");
    };
    fetchNetwork();

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
    <div>
      {network !== null ? (
        <>
          <p>Network List</p>
          <table className="network-table">
            <thead>
              <tr>
                <th>Peer ID</th>
                <th>Status</th>
                <th>Connected To</th>
                <th>Connection Count</th>
                <th>Call</th>
              </tr>
            </thead>
            <tbody>
              {network.globalPeers.sort(comparePeers).map((peer, index) => (
                <tr key={index}>
                  <td>{peer.peerId}</td>
                  <td>{peer.peerId === peerID ? "You" : ""}</td>
                  <td>{peer.peerId === targetPeer?.peerId ? "Connected To" : ""}</td>
                  <td>{network.peerConnectionsCount[peer.peerId] || 0}</td>
                  <td>
                    {!isInActiveCall(peer) ? (
                      <CallButton key={peer.peerId} peerId={peer.peerId} />
                    ) : (
                      <HangupButton key={peer.peerId} peerId={peer.peerId} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <span>Loading Network List</span>
      )}
    </div>
  );
};

export default NetworkList;
