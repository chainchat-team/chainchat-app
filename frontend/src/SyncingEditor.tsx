// Import React dependencies.
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { BaseOperation, Descendant, Editor, Operation, createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import io from "socket.io-client";



const socket = io("http://localhost:4000");

type PropsType = { groupId: string }

const Leaf = ({ attributes, children, leaf }) => {
    if (leaf.bold) {
        children = <strong>{children}</strong>
    }
    return <span {...attributes}>{children}</span>
}


const SyncingEditor = ({ groupId }: PropsType) => {
    const [editor] = useState(() => withReact(createEditor()));
    // Render the Slate context.
    const [value, setValue] = useState<Descendant[] | null>(null)
    const id = useRef(`${Date.now()}`);
    const remote = useRef(false);
    const renderLeaf = useCallback(props => <Leaf {...props} />, [])

    //upon rendering the component - register a event listener
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:4000/groups/${groupId}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch initial value");
                }
                const data = await response.json();
                setValue(data);
            } catch (error) {
                console.error("Error fetching initial value:", error);
            }
        };
        fetchData();
        const listener = ({ editorId, ops }: { editorId: string, ops: string }) => {
            if (id.current !== editorId) {
                remote.current = true
                JSON.parse(ops).forEach((op: any) => editor.apply(op));
                remote.current = false;
            }
        };
        socket.on(`new-remote-operations-${groupId}`, listener);
        return () => {
            socket.off(`new-remote-operations-${groupId}`, listener);
        };

    }, []);
    if (value === null) {
        // Handle the case when the initial value is still being fetched
        return <div>Loading...</div>;
    }
    return (
        <>
            <button onMouseDown={e => {
                e.preventDefault();
                console.log(JSON.stringify(editor.children))
                Editor.addMark(editor, 'bold', true)
            }}>Bold</button>
            <Slate
                editor={editor}
                initialValue={value}
                onChange={(decendants: Descendant[]) => {
                    console.log('change detected')
                    // setValue(decendants)
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
                        socket.emit("new-operations", {
                            editorId: id.current,
                            ops: JSON.stringify(ops),
                            value: decendants,
                            groupId: groupId
                        });
                    }
                }}
            >
                <Editable
                    renderLeaf={renderLeaf}
                    onKeyDown={(event) => {
                        switch (event.key) {
                            case 'b': {
                                event.preventDefault()
                                console.log('b pressed')
                                Editor.addMark(editor, 'italic', true)
                                break
                            }
                        }
                    }}
                />
            </Slate >
        </>
    )
}

export default SyncingEditor;

