// Import React dependencies.
import React, { useEffect, useRef, useState } from 'react'
import { BaseOperation, Editor, Operation, createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import initialValue from './slateInitialValue'
import io from "socket.io-client";


const socket = io("http://localhost:4000",);





const SyncingEditor = () => {
    const [editor] = useState(() => withReact(createEditor()))
    // Render the Slate context.
    const id = useRef(`${Date.now()}`);
    const remote = useRef(false);

    //upon rendering the component - register a event listener
    useEffect(() => {
        const listener = ({ editorId, ops }: { editorId: string, ops: string }) => {
            if (id.current !== editorId) {
                remote.current = true
                console.log('recived op from:', editorId, 'applying operation to:', id.current)
                console.log(JSON.parse(ops).forEach((op: any) => console.log(op.type, op.data)))
                JSON.parse(ops).forEach((op: any) => editor.apply(op));
                remote.current = false;
            }
        };
        socket.on("new-remote-operations", listener);
        return () => {
            socket.off("new-remote-operations", listener);
        };

    }, []);
    return (
        <Slate
            editor={editor}
            initialValue={initialValue}
            onChange={(decendants) => {
                const ops = editor.operations.filter(o => {
                    if (o) {
                        return (
                            o.type !== "set_selection" &&
                            o.type !== "merge_node" &&
                            (!o.data || !o.data.source)
                        );
                    }

                    return false;
                })
                    .map((o: any) => ({ ...o, data: { source: "one" } }));

                if (ops.length && !remote.current) {
                    socket.emit("new-operations", { editorId: id.current, ops: JSON.stringify(ops) });
                }
            }}
        >
            <Editable />
        </Slate >
    )
}

export default SyncingEditor;