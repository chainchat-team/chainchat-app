// Import React dependencies.
import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
    Node, Transforms, BaseOperation, Descendant, Editor, Operation,
    createEditor, InsertTextOperation, Text, Range, Selection
} from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import io from "socket.io-client";
import { createCrdt } from './lib/create-crdt';
import { CrdtInterface } from './lib/interfaces/Crdt';
const crdt = createCrdt()

const socket = io("http://localhost:4000");

type PropsType = { groupId: string }

const Leaf = ({ attributes, children, leaf }) => {
    // leaf.characters = []
    // attributes.characters = []
    // console.log(children)
    // console.log('here')
    if (leaf.bold) {
        children = <strong>{children}</strong>
    }

    return <span {...attributes}>{children}</span>
}


const withCustomNormalization = (editor: Editor) => {
    const { normalizeNode } = editor;

    editor.normalizeNode = (entry) => {
        const [node, path] = entry;

        // Normalize leaf nodes to include a `characters` property.
        if (Text.isText(node)) {
            if (node.characters === undefined) {
                // Add an empty characters array to the leaf node.
                Transforms.setNodes(editor, { ...node, characters: [] }, { at: path });
            }
        }

        // Call the original `normalizeNode` function for other normalizations. (built-in constraint)
        normalizeNode(entry);
    };

    return editor;
};


const SyncingEditor = ({ groupId }: PropsType) => {
    const [editor] = useState(() => withCustomNormalization(withReact(createEditor())));
    // const [editor] = useState(() => withReact(createEditor()));
    //NEXT: how do we add customer `character mark` on all text node by default??
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
                // console.log(JSON.stringify(editor.children))
                // const location1 = { path: [0, 0], offset: 0 }
                // editor.setPoint(location1)
                // Editor.addMark(editor, 'bold', true)
                // Editor.addMark(editor, 'characters', [0, 0, 0])

                const location2 = { path: [1, 0], offset: 0 }
                editor.setPoint(location2)
                // Editor.addMark(editor, 'bold', false)
                // Editor.addMark(editor, 'characters', [-1, -1, -1])
                // const location = [1, 0]
                // console.log(Editor.before(editor, location))
                // console.log(Editor.after(editor, location))
                // Node.get(editor.children[0], location)
                // console.log('--')
                // const [leafNode, path] = Editor.leaf(editor, location2)
                // console.log(leafNode)
                // console.log((leafNode as any).characters)
                // editor.setPoint(location1)
                // console.log(Editor.marks(editor))
                // console.log(Editor.marks(editor))
                // console.log('--')
                // Editor.withoutNormalizing(editor, () => {
                //     editor.apply({ type: 'split_node', path: [0], position: 0, properties: {} })
                //     editor.apply({ type: 'split_node', path: [0], position: 1, properties: {} })

                // })

                // editor.apply({ type: 'split_node', path: [0, 0], position: 1, properties: {} })
                // editor.apply({ type: 'split_node', path: [0, 1], position: 2, properties: {} })
                // const lineNode = { type: 'line', children: [{ text: 'new line added' }] }
                // editor.apply({ type: 'insert_node', path: [0, 0], node: lineNode });
                // editor.apply({ type: 'insert_text', path: [0, 0], offset: 0, text: 'Hello World'})
            }}>Bold</button>
            <Slate
                editor={editor}
                initialValue={value}
                onChange={(decendants: Descendant[]) => {
                    // console.log('change detected')
                    // setValue(decendants)
                    // console.log(decendants)
                    // console.log(editor.operations)
                    // console.log(editor.children)
                    // console.log(editor.operations)
                    // console.log(editor.selection)

                    // Capture the current selection
                    // if (selection && Range.isCollapsed(selection as Range)) {
                    //     // Editor.start(edit)
                    //     const start = Editor.start(editor, selection);
                    //     // console.log(Editor.start(editor, selection))
                    //     // Use Editor.nodes to find the ancestor nodes and their paths
                    //     const nodesAndPaths = Array.from(
                    //         Editor.nodes(editor, {
                    //             at: start.path,
                    //             mode: 'lowest', // Traverse from the current location to the lowest level
                    //         })
                    //     );
                    //     console.log(nodesAndPaths)
                    // }
                    // if (editor.operations[0]?.type === 'insert_text') {
                    //     console.log(Editor.before(editor, { path: editor.operations[0].path, offset: editor.operations[0].offset }))
                    //     console.log(Editor.after(editor, { path: editor.operations[0].path, offset: editor.operations[0].offset }))

                    // }
                    // const opPoint = { path: editor.operations[0].path, offset: editor.operations[0].offset }
                    // console.log(Editor.after(editor, opPoint))
                    if (editor.operations[0]?.type === 'insert_text' || editor.operations[0]?.type === 'split_node') {
                        const ops = editor.operations
                        CrdtInterface.handleLocalInsert(crdt, editor, ops)

                    }
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
                                // Editor.addMark(editor, 'italic', true)
                                // Editor.addMark(editor, 'characters', [1, 2, 3])
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

