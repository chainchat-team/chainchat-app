import { RouterProvider, createBrowserRouter, redirect } from 'react-router-dom';
import GroupEditor, { loader as groupEditorLoader } from './GroupEditor.tsx'

export async function loader() {
  return redirect(`group/${Date.now()}`)
}

const router = createBrowserRouter([
  {
    path: '/',
    loader: loader
  },
  {
    path: "group/:id",
    element: <GroupEditor />,
    loader: groupEditorLoader
  },
])




const App = () => {
  return (
    <RouterProvider router={router} />
  )
}

export default App;