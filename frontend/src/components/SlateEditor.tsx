// Import React dependencies.
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { BaseElement, BaseOperation, Editor, createEditor, string, Text, Point } from 'slate';
import { Editable, Slate, withReact } from 'slate-react';
import { eventBus } from '../lib/events/create-eventbus';
import { SyncRequest } from '../lib/types/SyncRequest';
import { Descendant } from '../types/Descendant';
import initialValue from '../slateInitialValue';
import { Crdt, CrdtInterface } from '../lib/interfaces/Crdt';
import { BroadcastOperation } from '../types/BroadcastOperation';
import { Char, CharInterface } from '../lib/interfaces/Char';
import { Editor as CustomEditor } from '../lib/interfaces/Editor';
type PropsType = {
    crdt: Crdt
}


const SlateEditor = ({ crdt }: PropsType) => {
    // is it possible
    const [editor] = useState(withReact(createEditor()))
    const [crdtState, setCrdt] = useState(crdt)
    const [initalValue, setInitalValue] = useState<Descendant[]>(
        [
            {
                children: [{ text: 'One line of text in a paragraph.', characters: [] }],
            },
            {
                children: [{ text: 'Two line of text in a paragraph.', characters: [] }],
            },
        ]
    )
    useEffect(() => {
        // initialize the editor
        const initialStructlistener = (req: SyncRequest) => {
            editor.children = req.initialStruct
            setInitalValue(req.initialStruct)
        }
        eventBus.on('handleSyncRequest', initialStructlistener);

        const responseInitialStruct = () => {
            eventBus.emit('response_initial_struct', editor.children)
        }
        eventBus.on('request_initial_struct', responseInitialStruct)

        // eventBus.on('handleRemoteOperation', (operation: BroadcastOperation) => {
        //     if (operation.type === 'insert') {
        //         CrdtInterface.handleRemoteInsert(operation.operations)
        //     }
        // })

        return () => {
            eventBus.off('handleSyncRequest', initialStructlistener)
            eventBus.off('request_initial_struct', responseInitialStruct)
        }
    }, [initialValue]);

    // const targetPeerId = location.search.slice(1) || 0
    // if (targetPeerId === 0) {
    //     setInitalValue([])
    // }
    return (
        <Slate editor={editor} initialValue={initalValue} onChange={(decendant) => {
            // const point = { path: [1, 0], offset: 0 }
            // const pointBefore = Editor.before(editor, point) as Point
            // console.log(Editor.leaf(editor, pointBefore))
            // console.log(editor.operations)
            console.log(editor.operations)
            if (editor.operations[0]?.type === 'insert_text' || editor.operations[0]?.type === 'split_node') {
                const ops = editor.operations
                CrdtInterface.handleLocalInsert(crdt, editor, ops)


                const [leaf, leafPath] = CustomEditor.lastValidLeaf(editor) as [any, any]
                const lastChar = leaf.characters[leaf.characters.length - 1] as Char
                const lastIdentifierDigit = lastChar.identifiers[lastChar.identifiers.length - 1].digit
                const dummyChar: Char = {
                    identifiers: [
                        ...lastChar.identifiers.slice(0, lastChar.identifiers.length - 1),
                        { digit: lastIdentifierDigit + 1, siteId: 1 }
                    ],
                    value: 'R',
                    counter: 1,
                    siteId: 1,

                }
                console.log('---run start---')
                console.log(editor.children)
                // console.log(`trying to add dummy char with: ${dummyChar.identifiers.map(val => val.digit)}`)
                console.log(dummyChar.identifiers)
                CrdtInterface.handleRemoteInsert(crdt, editor, dummyChar)
                console.log(editor.children)
                console.log('---run end---')

                // const payload: BroadcastOperation = {
                //     type: 'insert',
                //     operations: ops,
                // }
                // eventBus.emit('insert', payload)
            }
        }}>

            <Editable />
        </Slate>
    )
}

export default SlateEditor;

