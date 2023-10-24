// Import React dependencies.
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { BaseElement, BaseOperation, Editor, createEditor, string, Text, Point, Operation, BaseEditor, RemoveNodeOperation, MergeNodeOperation } from 'slate';
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
        let chars: Char[] = [];
        switch (operation.type) {
            case 'insert_text':
                apply(operation)
                chars = CrdtInterface.handleInsertTextOp(crdt, editor, [operation])
                break
            case 'split_node':
                apply(operation)
                chars = CrdtInterface.handleSplitNodeOp(crdt, editor, [operation])
                break
            case 'remove_text':
                chars = CrdtInterface.handleRemoveTextOp(crdt, editor, [operation])
                apply(operation)
                break
            case 'remove_node':
                chars = CrdtInterface.handleRemoveNodeOp(crdt, editor, [operation as RemoveNodeOperation])
                apply(operation)
                break
            case 'merge_node':
                chars = CrdtInterface.handleMergeNodeOp(crdt, editor, [operation as MergeNodeOperation])
                apply(operation)
                break
            default:
                apply(operation)
        }
        const eventType = ['remove_text', 'remove_node', 'merge_node'].includes(operation.type) ? 'delete' : 'insert'
        if (!(operation as RemoveTextOperation).isRemoteOperation) {
            chars.forEach(char => {
                const payload: BroadcastCrdtEvent = {
                    siteId: crdt.siteId,
                    peerId: crdt.peerId as string,
                    type: eventType,
                    char: char
                }
                eventBus.emit(eventType, payload)
            })
        }
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
            // console.log(editor.selection)
            console.log('----run--')
        }}>
            <Editable onPaste={(event) => {
                CrdtInterface.handleLocalPaste(crdt, editor, event)
                event.preventDefault()
            }} onCut={event => console.log('trying to cut')} />
        </Slate>
    )
}

export default SlateEditor
