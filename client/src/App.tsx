import React from "react";
import "./App.css";
import { useMediaRecorder } from "./useRecorder";
import { Button } from "primereact/button";
import { Editor } from "primereact/editor";
import { Toolbar } from "primereact/toolbar";
import { Badge } from "primereact/badge";

function App() {
  const [start, stop, isRun, messages] = useMediaRecorder();

  const handleStart = () => {
    start();
  };

  const handleStop = () => {
    stop();
  };

  const indicators = (
    <div className="flex align-items-center">
      <Badge severity={isRun ? "success" : "danger"}></Badge>
      <p className="ml-2">connection</p>
    </div>
  );

  const buttons = (
    <>
      <Button
        onClick={handleStart}
        label="Start"
        className="p-button-success mr-2"
      />
      <Button onClick={handleStop} label="Stop" className="p-button-danger" />
    </>
  );

  return (
    <>
      <Toolbar start={indicators} end={buttons} />
      <Editor value={messages.join(" ")} style={{ height: "320px" }} />
    </>
  );
}

export default App;
