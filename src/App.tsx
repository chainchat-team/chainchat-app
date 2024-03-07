import SlateEditor from "./components/SlateEditor.tsx";
import { createBroadcast } from "./lib/broadcast/create-broadcast.ts";
import { Peer as Peerjs } from "peerjs";
import { createCrdt } from "./lib/create-crdt.ts";
import { v1 as UUID } from "uuid";
import { createNetwork } from "./lib/network/create-network.ts";
import { Broadcast, BroadcastInterface } from "./lib/interfaces/Broadcast.ts";
import NetworkList from "./components/NetworkList.tsx";
import { Crdt } from "./lib/interfaces/Crdt.ts";
import { useEffect, useState } from "react";
import { createAddress } from "./lib/address/create-address.ts";
import Huddle from "./components/Huddle.tsx";
import { createHuddleManager } from "./lib/huddle/create-huddleManager.ts";
import SharingLink from "./components/SharingLink.tsx";
import "../src/css/style.css";
import Navbar from "./components/Navbar.tsx";
import StatusBar from "./components/StatusBar.tsx";

const targetPeerId = location.search.slice(1) || "";
const peerjs = new Peerjs();

const origin = location.origin;

createAddress(origin, targetPeerId, peerjs); // Fix the argument by using the 'origin' variable
const siteId = UUID();
createNetwork(peerjs, siteId);
const broadcast: Broadcast = createBroadcast(peerjs, siteId, targetPeerId);
const crdt: Crdt = createCrdt(peerjs, siteId);
createHuddleManager();

window.addEventListener("beforeunload", function (event) {
  BroadcastInterface.close(broadcast);
});

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [peerId, setPeerId] = useState<string | null>(null);
  useEffect(() => {
    peerjs.on("open", (id) => {
      setIsLoading(false);
      setPeerId(id);
    });
  });
  return (
    // <RouterProvider router={router} />
    <>
      {isLoading ? (
        <p>...Loading</p>
      ) : (
        <>
          <Navbar />
          <div className="text-wrapper">
            <div className="editor">
              <div className="header">
                <SharingLink />
                {/* <button id="download" className="button">
                  Save
                </button>
                <button id="upload" className="button">
                  Upload
                </button> */}
              </div>
              <SlateEditor crdt={crdt} peerId={peerjs.id} siteId={siteId} />
              <StatusBar />
            </div>
            <NetworkList peerId={peerjs.id} />
          </div>
          <Huddle peerId={peerId} />
        </>
      )}
    </>
  );
};

export default App;
