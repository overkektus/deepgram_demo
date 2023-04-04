import { Deepgram } from "@deepgram/sdk";
import dotenv from "dotenv";
import express from "express";
import { WebSocketServer } from "ws";
import fs from "fs";
import https from "https";
dotenv.config();

const deepgramApiKey = process.env.DEEPGRAM_API_KEY;
const port = Number(process.env.PORT) || 5000;

if (!deepgramApiKey) {
  throw new Error("You should provide api key for deepgram!");
}

const deepgram = new Deepgram(deepgramApiKey);

const app = express();

const server = https.createServer(
  {
    key: fs.readFileSync("./server/security/key.pem"),
    cert: fs.readFileSync("./server/security/cert.pem"),
  },
  app
);

server.listen(port, () => {
  console.log(`Server is run on port: ${port}`);
});

const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  const deepgramSocket = deepgram.transcription.live({
    punctuate: true,
    language: "de",
  });
  deepgramSocket.addListener("open", () => {
    console.log("open");
  });
  deepgramSocket.addListener("close", () => {
    console.log("close");
  });
  deepgramSocket.addListener("error", (error) => {
    console.log("error");
    console.log(error);
  });

  ws.on("message", (message: Blob) => {
    deepgramSocket.send(message);
  });

  ws.on("close", () => {
    deepgramSocket.finish();
  });

  deepgramSocket.addListener("transcriptReceived", (transcription) => {
    const obj = JSON.parse(transcription);
    const part = obj?.channel?.alternatives[0].transcript;
    console.log(part);
    console.log("----------");
    if (obj.is_final && part) {
      ws.send(part);
    }
  });
});
