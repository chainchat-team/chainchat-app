import { RouterProvider, createBrowserRouter, redirect } from 'react-router-dom';
import GroupEditor, { loader as groupEditorLoader } from './GroupEditor.tsx'
import SlateEditor from './components/SlateEditor.tsx';
import PeerId from './components/PeerId.tsx';
import { createBroadcast } from './lib/broadcast/create-broadcast.ts';
import Peer from 'peerjs';
import { createCrdt } from './lib/create-crdt.ts';

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
  port: 3000,
  path: '/server',
})
const siteId = 1
const broadcast = createBroadcast(peer, siteId, targetPeerId)
const crdt = createCrdt()


const App = () => {
  return (
    // <RouterProvider router={router} />
    <>
      <PeerId />
      <SlateEditor crdt={crdt} />
    </>
  )
}

export default App;