import { useEffect, useRef, useState } from "react";
import { createEditor, BaseEditor, Element, Range, Editor, BaseElement } from "slate";
import { Editable, ReactEditor, Slate, withReact } from "slate-react";
import { eventBus } from "../lib/events/create-eventbus";
import { BroadcastCrdtEvent, BroadcastSyncRequestEvent } from "../lib/types/BroadcastEventTypes";
import { Descendant } from "../types/Descendant";
import initialValue from "../slateInitialValue";
import { Crdt, CrdtInterface } from "../lib/interfaces/Crdt";
import { Char, CharInterface } from "../lib/interfaces/Char";
import { VersionVectorInterface } from "../lib/interfaces/VersionVector";
import { CustomOperation } from "../lib/types/Operation";
import "../css/style.css";
import { PeerEvent } from "../lib/types/PeerEventTypes";
import { Text } from "../lib/interfaces/Text";

type PropsType = {
  crdt: Crdt;
  peerId: string;
  siteId: string;
};

const withCustomRemoveOperation = (editor: BaseEditor, crdt: Crdt) => {
  const { apply } = editor;
  editor.apply = (operation) => {
    let chars: Char[] = [];
    switch (operation.type) {
      case "insert_text":
        apply(operation);
        chars = CrdtInterface.handleInsertTextOp(crdt, editor, [operation]);
        break;
      case "split_node":
        apply(operation);
        chars = CrdtInterface.handleSplitNodeOp(crdt, editor, [operation]);
        break;
      case "remove_text":
        chars = CrdtInterface.handleRemoveTextOp(crdt, editor, [operation]);
        apply(operation);
        break;
      case "remove_node":
        chars = CrdtInterface.handleRemoveNodeOp(crdt, editor, [operation]);
        apply(operation);
        break;
      case "merge_node":
        chars = CrdtInterface.handleMergeNodeOp(crdt, editor, [operation]);
        apply(operation);
        break;
      default:
        apply(operation);
    }

    if (!(operation as CustomOperation).isRemoteOperation) {
      const eventType = ["remove_text", "remove_node", "merge_node"].includes(operation.type) ? "delete" : "insert";
      chars.forEach((char) => {
        if (crdt.versionVector === null) throw new Error("Crdt version vector is null.");
        CrdtInterface.incrementVersionVector(crdt);
        const payload: PeerEvent = {
          siteId: crdt.siteId,
          peerId: crdt.peerId as string,
          type: eventType,
          char: char,
          version: VersionVectorInterface.getLocalVersion(crdt.versionVector),
        };
        eventBus.emit(eventType, payload);
      });
    }
  };
  return editor;
};

const SlateEditor = ({ crdt, peerId, siteId }: PropsType) => {
  // is it possible
  // const [editor] = useState(withReact(withEventBusPlugIn(withCustomRemoveOperation(createEditor(), crdt))))
  const [editor] = useState(withReact(withCustomRemoveOperation(createEditor(), crdt)));
  // const [editor] = useState(withReact(createEditor()))
  const [crdtState, setCrdt] = useState(crdt);
  const [peerIdState, setPeerId] = useState<string>(peerId);
  const [siteIdState, setSiteId] = useState(siteId);
  const remote = useRef(false);
  const [initalValue, setInitalValue] = useState<Descendant[]>([
    {
      children: [{ text: "", characters: [] }],
    },
  ]);
  // Add this line inside your SlateEditor component, but outside of any hooks or return statements
  const [dummyCursor, setDummyCursor] = useState<Range | null>(null);
  useEffect(() => {
    // initialize the editor
    const initialStructlistener = (req: BroadcastSyncRequestEvent) => {
      editor.children = req.initialStruct;
      setInitalValue(req.initialStruct);
    };
    eventBus.on("handleSyncRequest", initialStructlistener);

    const responseInitialStruct = () => {
      editor.children;
      eventBus.emit("response_initial_struct", editor.children as Descendant[]);
    };
    eventBus.on("request_initial_struct", responseInitialStruct);
    eventBus.on("requestEditorDescendant", () => {
      eventBus.emit("responseEditorDescendant", editor.children as Descendant[]);
    });

    const handleRemoteOperation = async (operation: BroadcastCrdtEvent) => {
      console.log("---handleRemoteOperation-start----");
      if (crdt.versionVector != null && VersionVectorInterface.hasBeenApplied(crdt.versionVector, operation.version))
        return;
      if (operation.type === "insert") {
        await CrdtInterface.handleRemoteInsert(crdt, editor, operation.char, operation.version);
      } else if (operation.type === "delete") {
        CrdtInterface.addToDeletionBuffer(crdt, operation);
      }
      await CrdtInterface.processDeletionBuffer(crdt, editor);
      const operationType = operation.type === "insert" ? "insert" : "delete";
      eventBus.emit(operationType, operation);
      console.log("---handleRemoteOperation--end----");
    };
    eventBus.on("handleRemoteOperation", handleRemoteOperation);

    // Set the dummy cursor to a specific position
    setDummyCursor({
      anchor: { path: [0, 0], offset: 1 },
      focus: { path: [0, 0], offset: 1 },
    });

    return () => {
      eventBus.off("handleSyncRequest", initialStructlistener);
      eventBus.off("request_initial_struct", responseInitialStruct);
      eventBus.off("handleRemoteOperation", handleRemoteOperation);
    };
  }, [initialValue]);

  // Function to measure the width of a text string
  const measureTextWidth = (text: string) => {
    const measurementElement = document.createElement("span");
    measurementElement.style.visibility = "hidden";
    measurementElement.style.whiteSpace = "pre";
    measurementElement.textContent = text;
    document.body.appendChild(measurementElement);
    const width = measurementElement.getBoundingClientRect().width;
    document.body.removeChild(measurementElement);
    return width;
  };

  return (
    <Slate
      editor={editor}
      initialValue={initalValue}
      onChange={(decendant) => {
        const totalLines = editor.children.length;
        const totalWords = editor.children.reduce((acc, child) => {
          return (
            acc + (child as Element).children.map((c) => (c as Text).text.split(" ").filter((c) => c != "").length)[0]
          );
        }, 0);
        const cursorPoint = editor.selection?.anchor;

        eventBus.emit("updateEditorStatistics", { totalLines, totalWords, cursorPoint });
      }}
    >
      <Editable
        renderLeaf={(props) => {
          // Inside your renderLeaf function...
          const { children, attributes } = props;
          // Check if the editor is empty
          const leaf = props.leaf as Text;
          if (leaf.characters.length === 0) {
            return <span {...attributes}>{children}</span>;
          }

          // Get the path of the leaf

          const path = CharInterface.findEditorPath(leaf.characters[0], editor);

          // Create a range from the path
          const leafRange = Editor.range(editor, path);
          // Calculate the width of the characters before the cursor
          const textBeforeCursor = leaf.text.slice(0, dummyCursor?.anchor.offset);
          const dummyCursorLeft = measureTextWidth(textBeforeCursor);
          return (
            <span {...props.attributes}>
              {dummyCursor && Range.includes(leafRange, dummyCursor) && (
                <span
                  style={{
                    position: "absolute",
                    left: `${dummyCursorLeft}px`,
                    top: "0",
                    background: "blue",
                    width: "2px",
                    height: "1em",
                  }}
                />
              )}
              {props.children}
            </span>
          );
        }}
        onPaste={(event) => {
          CrdtInterface.handleLocalPaste(crdt, editor, event);
          event.preventDefault();
        }}
        className="CodeMirror CodeMirror-scroll CodeMirror-focused"
      />
    </Slate>
  );
};

export default SlateEditor;
