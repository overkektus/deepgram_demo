import React from "react";
import "./App.css";
import { useMediaRecorder } from "./useRecorder";

function App() {
  const [start, stop, clear, isRun, messages] = useMediaRecorder();

  const handleStart = () => {
    start();
  };

  const handleStop = () => {
    stop();
  };

  const handleClear = () => {
    clear();
  };

  return (
    <div className="App">
      <button onClick={handleStart}>Start</button>
      <button onClick={handleStop}>Stop</button>
      <button onClick={handleClear}>Clear</button>
      <textarea defaultValue={messages.join(" ")}></textarea>
    </div>
  );
}

export default App;
