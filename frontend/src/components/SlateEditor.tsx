// Import React dependencies.
import React, { useCallback, useEffect, useRef, useState, version } from "react";
import { BaseElement, BaseOperation, Editor, createEditor, string, Text, Point, Operation, BaseEditor } from "slate";
import { Editable, Slate, withReact } from "slate-react";
import { eventBus } from "../lib/events/create-eventbus";
import { BroadcastCrdtEvent, BroadcastSyncRequestEvent } from "../lib/types/BroadcastEventTypes";
import { Descendant } from "../types/Descendant";
import initialValue from "../slateInitialValue";
import { Crdt, CrdtInterface } from "../lib/interfaces/Crdt";
import { BroadcastOperation } from "../types/BroadcastOperation";
import { Char, CharInterface } from "../lib/interfaces/Char";
import { Editor as CustomEditor } from "../lib/interfaces/Editor";
import { VersionInterface } from "../lib/interfaces/Version";
import { VersionVector, VersionVectorInterface } from "../lib/interfaces/VersionVector";
import { CustomOperation, MergeNodeOperation, RemoveNodeOperation, RemoveTextOperation } from "../lib/types/Operation";
import { NetworkInterface } from "../lib/interfaces/Network";
import "../css/style.css";

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
        const payload: BroadcastCrdtEvent = {
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
  useEffect(() => {
    // initialize the editor
    const initialStructlistener = (req: BroadcastSyncRequestEvent) => {
      editor.children = req.initialStruct;
      setInitalValue(req.initialStruct);
    };
    eventBus.on("handleSyncRequest", initialStructlistener);

    const responseInitialStruct = () => {
      eventBus.emit("response_initial_struct", editor.children);
    };
    eventBus.on("request_initial_struct", responseInitialStruct);
    eventBus.on("requestEditorDescendant", () => {
      eventBus.emit("responseEditorDescendant", editor.children);
    });

    const handleRemoteOperation = async (operation: BroadcastCrdtEvent) => {
      console.log("---handleRemoteOperation-start----");
      console.log(crdt);
      console.log(operation.version);
      if (VersionVectorInterface.hasBeenApplied(crdt.versionVector, operation.version)) return;
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

    return () => {
      eventBus.off("handleSyncRequest", initialStructlistener);
      eventBus.off("request_initial_struct", responseInitialStruct);
      eventBus.off("handleRemoteOperation", handleRemoteOperation);
    };
  }, [initialValue]);

  return (
    <Slate
      editor={editor}
      initialValue={initalValue}
      onChange={(decendant) => {
        const totalLines = editor.children.length;
        const totalWords = editor.children.reduce((acc, child) => {
          return acc + child.children.map((c) => c.text.split(" ").filter((c) => c != "").length)[0];
        }, 0);
        const cursorPoint = editor.selection?.anchor;

        eventBus.emit("updateEditorStatistics", { totalLines, totalWords, cursorPoint });
      }}
    >
      <Editable
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
