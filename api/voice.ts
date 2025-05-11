// api/voice.ts
import request from "../utils/request";
import * as FileSystem from "expo-file-system";
import { Buffer } from "buffer";

export const sendAudioToWhisper = async (uri: string) => {
  const formData = new FormData();
  formData.append("file", {
    uri,
    name: "recording.wav",
    type: "audio/wav",
  });

  const res = await request.post("/transcribe", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data.text;
};

export const sendToGpt = async (messages: any[]) => {
  const res = await request.post("/chat", { messages });
  return res.data.reply;
};

export const fetchTTS = async (text: string, voice: string) => {
  const res = await request.post(
    "/tts",
    { text, voice },
    {
      responseType: "arraybuffer",
    }
  );

  const base64 = Buffer.from(res.data).toString("base64");
  const fileUri = FileSystem.documentDirectory + "tts-speech.mp3";

  await FileSystem.writeAsStringAsync(fileUri, base64, {
    encoding: FileSystem.EncodingType.Base64,
  });

  return fileUri;
};
