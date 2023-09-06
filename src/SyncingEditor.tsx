// Import React dependencies.
import React, { useEffect, useRef, useState } from 'react'
import { BaseOperation, Editor, Operation, createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import initialValue from './slateInitialValue'
import mitt, { Emitter } from "mitt"



const emitter = mitt();




const SyncingEditor = () => {
    const [editor] = useState(() => withReact(createEditor()))
    // Render the Slate context.
    const id = useRef(`${Date.now()}`);
    const remote = useRef(false);
    const editor_ref = useRef<Editor | null>(null)

    //upon rendering the component - register a event listener
    useEffect(() => {
        const listener = (type: string, event: Operation[]) => {
            if (id.current !== type) {
                remote.current = true
                console.log('recived op from:', type, 'applying operation to:', id.current)
                console.log(event.forEach(op => console.log(op.type, op.data)))
                event.forEach(op => editor.apply(op));
                remote.current = false;
            }
        };
        (emitter as any).on("*", listener);
        return () => {
            (emitter as any).off("*", listener);
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
                    emitter.emit(id.current, ops);
                }
            }}
        >
            <Editable />
        </Slate >
    )
}

export default SyncingEditor;