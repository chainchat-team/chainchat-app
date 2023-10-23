// Import React dependencies.
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { BaseElement, BaseOperation, Editor, createEditor, string, Text, Point, Operation, BaseEditor } from 'slate';
import { Editable, Slate, withReact } from 'slate-react';
import { eventBus } from '../lib/events/create-eventbus';
import { BroadcastCrdtEvent, BroadcastSyncRequestEvent } from '../lib/types/BroadcastEventTypes';
import { Descendant } from '../types/Descendant';
import initialValue from '../slateInitialValue';
import { Crdt, CrdtInterface } from '../lib/interfaces/Crdt';
import { BroadcastOperation } from '../types/BroadcastOperation';
import { Char, CharInterface } from '../lib/interfaces/Char';
import { Editor as CustomEditor } from '../lib/interfaces/Editor';
import { RemoveTextOperation } from '../lib/types/RemoveTextOperation';
import { InsertTextOperation } from '../lib/types/InsertTextOperation';
type PropsType = {
    crdt: Crdt,
    peerId: string,
    siteId: number
}

const withCustomRemoveOperation = (editor: BaseEditor, crdt: Crdt) => {
    const { apply } = editor
    editor.apply = operation => {
        if (['remove_text', 'merge_node', 'remove_node'].includes(operation.type)) {
            const removedChars: Char[] = CrdtInterface.handleLocalDelete(crdt, editor, [operation])
            if (!(operation as RemoveTextOperation).isRemoteOperation) {
                removedChars.forEach(char => {
                    const payload: BroadcastCrdtEvent = {
                        siteId: crdt.siteId,
                        peerId: crdt.peerId as string,
                        type: 'delete',
                        char: char
                    }
                    eventBus.emit('delete', payload)
                })
            }
        }
        apply(operation)
        // } else if (['insert_text', 'split_node'].includes(operation.type)) {
        //     apply(operation)
        //     const insertedChars: Char[] = CrdtInterface.handleLocalInsert(crdt, editor, [operation])
        //     if (!(operation as InsertTextOperation).isRemoteOperation) {
        //         insertedChars.forEach(char => {
        //             const payload: BroadcastCrdtEvent = {
        //                 siteId: crdt.siteId,
        //                 peerId: crdt.peerId as string,
        //                 type: 'delete',
        //                 char: char
        //             }
        //             eventBus.emit('delete', payload)
        //         })

        //     }

        // }
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
            } else if (operation.type === 'delete') {
                // I don't want handRemoteDelete to fire another event back to the sender
                // it will fire another event because. `handleRemoteDelete` -> .apply -> handleLocalDelete (which fires)
                console.log('------handling remote delete-----')
                console.log(operation)
                console.log('------handling remote delete-----')
                CrdtInterface.handleRemoteDelete(crdt, editor, operation.char)
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
            console.log(editor.selection)
            console.log('----run--')
            if (editor.operations[0]?.type === 'insert_text' || editor.operations[0]?.type === 'split_node') {
                // const ops = editor.operations

                // if (!remote.current) {
                //     const char: Char[] = CrdtInterface.handleLocalInsert(crdt, editor, ops)
                //     const payload: BroadcastCrdtEvent = {
                //         siteId: siteIdState,
                //         peerId: peerIdState,
                //         type: 'insert',
                //         char: char
                //     }
                //     eventBus.emit('insert', payload)
                // }
            }
        }}>
            <Editable onPaste={(event) => {
                // CrdtInterface.handleLocalPaste(crdt, editor, event)
                // event.preventDefault()
            }} onCut={event => event.preventDefault()} />
        </Slate>
    )
}

export default SlateEditor
