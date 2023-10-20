// Import React dependencies.
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { BaseElement, BaseOperation, Editor, createEditor, string, Text, Point, Operation, BaseEditor, Node } from 'slate';
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

const withCustomRemoveOperation = (editor: BaseEditor, crdt: Crdt) => {
    const { apply } = editor
    editor.apply = operation => {
        if (['remove_text', 'merge_node', 'remove_node'].includes(operation.type)) {
            CrdtInterface.handleLocalDelete(crdt, editor, [operation])
        }
        apply(operation)
    }
    return editor
}

const SlateEditor = ({ crdt, peerId, siteId }: PropsType) => {
    // is it possible
    const [editor] = useState(withReact(withCustomRemoveOperation(createEditor(), crdt)))
    const [crdtState, setCrdt] = useState(crdt)
    const [peerIdState, setPeerId] = useState<string>(peerId)
    const [siteIdState, setSiteId] = useState(siteId)
    const remote = useRef(false);
    const [initalValue, setInitalValue] = useState<Descendant[]>(
        [
            {
                children: [{ text: '', characters: [] }],
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
            console.log('----run--')
            console.log(editor.children)
            console.log(editor.operations)
            // console.log(editor.selection)
            console.log('----run--')
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
            <Editable onPaste={(event) => {
                // console.log(editor.selection)
                const clipboardData = event.clipboardData
                const pastedText = clipboardData.getData('text/plain');
                const characters = pastedText.split('')
                // paste work on range
                // so we need to delete the stuff inside the selection
                // we don't have the logic for removing yet.
                // then start inserting character at the location
                characters.forEach(val => {
                    const ops = [{
                        type: 'insert_text',
                        path: editor.selection?.anchor.path,
                        offset: 1
                    }]
                    // CrdtInterface.handleLocalInsert(crdt,editor,ops)
                })
                event.preventDefault()
            }} />
        </Slate>
    )
}

export default SlateEditor;

