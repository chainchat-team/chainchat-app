import { useEffect, useState } from "react";
import { Point } from "slate/dist/interfaces/point";
import { eventBus } from "../lib/events/create-eventbus";
import "../css/style.css";

const StatusBar = () => {
  // create 3 states, numWords, numLines, and cursorPoint
  const [numWords, setNumWords] = useState<number>(0);
  const [numLines, setNumLines] = useState<number>(0);
  const [cursorPoint, setCursorPoint] = useState<Point | undefined>(undefined);

  useEffect(() => {
    const updateEditorStatistics = ({
      totalLines,
      totalWords,
      cursorPoint,
    }: {
      totalLines: number;
      totalWords: number;
      cursorPoint: Point | undefined;
    }) => {
      setNumWords(totalWords);
      setNumLines(totalLines);
      if (cursorPoint !== undefined) {
        setCursorPoint(cursorPoint);
      }
    };
    eventBus.on("updateEditorStatistics", updateEditorStatistics);

    return () => {
      eventBus.off("updateEditorStatistics", updateEditorStatistics);
    };
  }, []);
  return (
    <div className="editor-statusbar">
      <span>lines:{numLines}</span>
      <span>words:{numWords}</span>
      {cursorPoint !== undefined ? (
        <span>
          cursor: {cursorPoint.path.length - 1}:{cursorPoint.offset}
        </span>
      ) : null}
    </div>
  );
};

export default StatusBar;
