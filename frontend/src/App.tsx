import { RouterProvider, createBrowserRouter, redirect } from "react-router-dom";
import GroupEditor, { loader as groupEditorLoader } from "./GroupEditor.tsx";
import SlateEditor from "./components/SlateEditor.tsx";
import PeerId from "./components/PeerId.tsx";
import { createBroadcast } from "./lib/broadcast/create-broadcast.ts";
import { Peer as Peerjs } from "peerjs";
import { createCrdt } from "./lib/create-crdt.ts";
import { v1 as UUID } from "uuid";
import { createNetwork } from "./lib/network/create-network.ts";
import { Broadcast, BroadcastInterface } from "./lib/interfaces/Broadcast.ts";
import NetworkList from "./components/NetworkList.tsx";
import { Crdt } from "./lib/interfaces/Crdt.ts";
import { Network } from "./lib/interfaces/Network.ts";
import { useEffect, useState } from "react";
import { eventBus } from "./lib/events/create-eventbus.ts";
import { createAddress } from "./lib/address/create-address.ts";
import Huddle from "./components/Huddle.tsx";
import { createHuddleManager } from "./lib/huddle/create-huddleManager.ts";
import { HuddleManager } from "./lib/interfaces/HuddleManager.ts";
import SharingLink from "./components/SharingLink.tsx";
// export async function loader() {
//   return redirect(`group/${Date.now()}`)
// }

// const router = createBrowserRouter([
//   {
//     path: '/',
//     loader: loader
//   },
//   {
//     path: "group/:id",
//     element: <GroupEditor />,
//     loader: groupEditorLoader
//   },
// ])
const targetPeerId = location.search.slice(1) || "";
// console.log(targetPeerId)
// const peerjs = new Peerjs({
//   host: "localhost",
//   port: 4000,
//   path: "/server",
// });

const peerjs = new Peerjs();

const address = createAddress("http://localhost", "5173", targetPeerId, peerjs);
const siteId = UUID();
const network: Network = createNetwork(peerjs, siteId);
const broadcast: Broadcast = createBroadcast(peerjs, siteId, targetPeerId);
const crdt: Crdt = createCrdt(peerjs, siteId);
const huddleManager: HuddleManager = createHuddleManager();

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
          <PeerId peerId={peerId} />
          <SharingLink />
          <NetworkList />
          <SlateEditor crdt={crdt} peerId={peerjs.id} siteId={siteId} />
          <Huddle peerId={peerId} />
        </>
      )}
    </>
  );
};

export default App;
