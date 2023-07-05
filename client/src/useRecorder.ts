import { useState } from "react";

export const useMediaRecorder = () => {
  const [isRun, setIsRun] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [websocket, setWebsocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);

  const start = async () => {
    setIsRun(true);
    const wsc = new WebSocket("wss://localhost:5002");
    setWebsocket(wsc);

    wsc.addEventListener("message", (event) => {
      setMessages((prevMessages) => [...prevMessages, event.data]);
    });

    wsc.addEventListener("close", () => {
      stop();
    });

    const stream = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: true,
    });
    setMediaStream(stream);

    const recorder = new MediaRecorder(stream, {
      mimeType: "audio/webm",
    });
    setMediaRecorder(recorder);

    recorder.addEventListener("dataavailable", async (event) => {
      if (wsc.readyState === 1 && event.data.size > 0) {
        wsc.send(event.data);
      }
    });

    recorder.start(2000);
  };

  const stop = () => {
    setIsRun(false);
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
    }

    if (mediaStream) {
      mediaStream.getAudioTracks().forEach((track) => {
        track.stop();
      });
    }
    
    if (websocket) {
      websocket.close();
    }
  };

  return [start, stop, isRun, messages] as const;
};
