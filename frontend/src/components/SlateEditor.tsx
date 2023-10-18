// Import React dependencies.
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { BaseElement, BaseOperation, Editor, createEditor, string, Text, Point, Operation } from 'slate';
import { Editable, Slate, withReact } from 'slate-react';
import { eventBus } from '../lib/events/create-eventbus';
import { BroadcastCrdtEvent, BroadcastSyncRequestEvent } from '../lib/types/BroadcastEventTypes';
import { Descendant } from '../types/Descendant';
import initialValue from '../slateInitialValue';
import { Crdt, CrdtInterface } from '../lib/interfaces/Crdt';
import { BroadcastOperation } from '../types/BroadcastOperation';
import { Char, CharInterface } from '../lib/interfaces/Char';
import { Editor as CustomEditor } from '../lib/interfaces/Editor';
type PropsType = {
    crdt: Crdt,
    peerId: string,
    siteId: number
}


const SlateEditor = ({ crdt, peerId, siteId }: PropsType) => {
    // is it possible
    const [editor] = useState(withReact(createEditor()))
    const [crdtState, setCrdt] = useState(crdt)
    const [peerIdState, setPeerId] = useState<string>(peerId)
    const [siteIdState, setSiteId] = useState(siteId)
    const remote = useRef(false);
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
        const initialStructlistener = (req: BroadcastSyncRequestEvent) => {
            editor.children = req.initialStruct
            setInitalValue(req.initialStruct)
        }
        eventBus.on('handleSyncRequest', initialStructlistener);

        const responseInitialStruct = () => {
            eventBus.emit('response_initial_struct', editor.children)
        }
        eventBus.on('request_initial_struct', responseInitialStruct)

        const handleRemoteOperation = async (operation: BroadcastCrdtEvent) => {
            if (operation.type === 'insert') {
                remote.current = true
                await CrdtInterface.handleRemoteInsert(crdt, editor, operation.char)
                remote.current = false
            }
        }
        eventBus.on('handleRemoteOperation', handleRemoteOperation)

        return () => {
            eventBus.off('handleSyncRequest', initialStructlistener)
            eventBus.off('request_initial_struct', responseInitialStruct)
            eventBus.off('handleRemoteOperation', handleRemoteOperation)
        }
    }, [initialValue]);

    return (
        <Slate editor={editor} initialValue={initalValue} onChange={(decendant) => {
            console.log(editor.children)
            if (editor.operations[0]?.type === 'insert_text' || editor.operations[0]?.type === 'split_node') {
                const ops = editor.operations
                if (!remote.current) {
                    const char: Char = CrdtInterface.handleLocalInsert(crdt, editor, ops)
                    const payload: BroadcastCrdtEvent = {
                        siteId: siteIdState,
                        peerId: peerIdState,
                        type: 'insert',
                        char: char
                    }
                    eventBus.emit('insert', payload)
                }
            }
        }}>
            <Editable />
        </Slate>
    )
}

export default SlateEditor;

