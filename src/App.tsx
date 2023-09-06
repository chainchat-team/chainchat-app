// Import React dependencies.
import React, { useState } from 'react'
// Import the Slate editor factory.
import { createEditor } from 'slate'

// Import the Slate components and React plugin.
import { Slate, Editable, withReact } from 'slate-react'
import initialValue from './slateInitialValue'
import SyncingEditor from './SyncingEditor'


// type CustomText = { text: string }
// type CustomElement = { type: 'paragraph'; children: CustomText[] }




const App = () => {
  // Render the Slate context.
  return (
    <div>
      <SyncingEditor />
      <SyncingEditor />
      {/* <SyncingEditor /> */}
    </div>
  )
}

export default App;