import { RouterProvider, createBrowserRouter, redirect } from 'react-router-dom';
import GroupEditor, { loader as groupEditorLoader } from './GroupEditor.tsx'
import SlateEditor from './components/SlateEditor.tsx';
import PeerId from './components/PeerId.tsx';
import { createBroadcast } from './lib/broadcast/create-broadcast.ts';
import Peer from 'peerjs';
import { createCrdt } from './lib/create-crdt.ts';
import { v1 as UUID } from 'uuid';
import { createNetwork } from './lib/network/create-network.ts';
import { BroadcastInterface } from './lib/interfaces/Broadcast.ts';
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
const targetPeerId = location.search.slice(1) || '0'
// console.log(targetPeerId)
const peer = new Peer({
  host: 'localhost',
  port: 4000,
  path: '/server',
})
const siteId = UUID()
const network = createNetwork()
const broadcast = createBroadcast(peer, siteId, targetPeerId)
const crdt = createCrdt(siteId)

window.addEventListener('beforeunload', function (event) {
  BroadcastInterface.close(broadcast)
});


const App = () => {
  return (
    // <RouterProvider router={router} />
    <>
      <PeerId />
      <SlateEditor crdt={crdt} peerId={peer.id} siteId={siteId} />
    </>
  )
}

export default App;