import { Buffer } from "buffer";
global.Buffer = global.Buffer || Buffer;
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { View, StatusBar, Image, Alert } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import { Audio } from "expo-av";
import axios from "axios";
import LottieView from "lottie-react-native";
import * as FileSystem from "expo-file-system";
import VoiceSettingModal from "../components/SettingModel";
import TextDisplay from "../components/TextDisplay";
import RecordButton from "../components/RecordButton";
import LoadingAnimation from "../components/LoadingAnimation";
import ControlButtons from "../components/ControlButtons";
import { playSoundAndVibrate } from "../utils/haptics";
import { sendAudioToWhisper, sendToGpt, fetchTTS } from "../api/voice";

export default function HomeScreen() {
  const [isRecording, setIsRecording] = React.useState(false);
  const [recording, setRecording] = React.useState<Audio.Recording>();
  const [aiResponse, setAiResponse] = React.useState<boolean | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [text, setText] = React.useState("");
  const [aiSpeaking, setAiSpeaking] = React.useState(false);
  const [voice, setVoice] = React.useState("nova");
  const lottieRef = React.useRef<LottieView>(null);
  const [chatHistory, setChatHistory] = React.useState([
    { role: "system", content: "你是一个有帮助的语音助手。" },
  ]);
  const ttsSoundRef = React.useRef<Audio.Sound | null>(null); // 用于中止播放
  const [allowContinue, setAllowContinue] = React.useState(false);

  const getMicrophonePermission = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          "Permission",
          "Please allow microphone access in settings."
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error requesting permissions:", error);
      return false;
    }
  };

  const startRecording = async () => {
    const permission = await getMicrophonePermission();
    console.log("Permission status:", permission);
    if (!permission) return;
    playSoundAndVibrate(isRecording);
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording } = await Audio.Recording.createAsync(recordingOptions);
      setRecording(recording);
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      Alert.alert("Error", "Failed to start recording.");
    }
  };

  const recordingOptions: any = {
    android: {
      extension: ".m4a",
      outputFormat: Audio.AndroidOutputFormat.MPEG_4,
      audioEncoder: Audio.AndroidAudioEncoder.AAC,
      sampleRate: 44100,
      bitRate: 128000,
      numberOfChannels: 1,
    },
    ios: {
      extension: ".caf",
      audioQuality: Audio.IOSAudioQuality.HIGH,
      sampleRate: 44100,
      bitRate: 128000,
      numberOfChannels: 1,
      linearPCMBitDepth: 16,
      linearPCMIsFloat: false,
      linearPCMIsBigEndian: false,
    },
  };

  const stopRecording = async () => {
    try {
      if (!recording) {
        console.warn("No recording instance found");
        return;
      }

      setIsRecording(false);
      setIsLoading(true);
      playSoundAndVibrate(isRecording);

      await recording.stopAndUnloadAsync();
      await recording.getStatusAsync();
      await recording._cleanupForUnloadedRecorder(); // 可选但推荐清理
      const uri = recording.getURI();
      setRecording(undefined); // 清空状态

      if (!uri) {
        throw new Error("Recording URI not available");
      }

      const transcript = await sendAudioToWhisper(uri);
      setText(transcript);
      const gptResponse = await handleSendToGpt(transcript);
      setAiResponse(true);
      setAiSpeaking(true);
      await speakText(gptResponse);
    } catch (error) {
      console.error("Error stopping recording:", error);
      Alert.alert("Error", "Recording failed. Please try again.");
    } finally {
      setRecording(undefined); // 清空 recording 避免残留
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
      setIsLoading(false);
    }
  };

  // const sendAudioToAi = async (uri: string) => {
  //   try {
  //     const formData: any = new FormData();
  //     formData.append("file", {
  //       uri,
  //       name: "recording.wav",
  //       type: "audio/wav",
  //     });
  //     formData.append("model", "whisper-1"); // Assuming the model is required
  //     const response = await axios.post(
  //       "https://api.openai.com/v1/audio/transcriptions",
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //           Authorization: `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`, // Replace with your actual API key
  //         },
  //       }
  //     );
  //     console.log("AI Response:", response.data.text);
  //     return response.data.text;
  //   } catch (error) {
  //     console.error("Error sending audio to AI:", error);
  //     Alert.alert("Error", "Failed to send audio to AI.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleSendToGpt = async (text: string, appendToHistory = true) => {
    try {
      const newMessage = { role: "user", content: text };
      const updatedHistory = appendToHistory
        ? [...chatHistory, newMessage]
        : [...chatHistory];

      // const response = await axios.post(
      //   "https://api.openai.com/v1/chat/completions",
      //   {
      //     model: "gpt-3.5-turbo",
      //     messages: updatedHistory,
      //   },
      //   {
      //     headers: {
      //       Authorization: `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`,
      //       "Content-Type": "application/json",
      //     },
      //   }
      // );
      const response = await sendToGpt(updatedHistory);
      console.log("🚀 ~ handleSendToGpt ~ response:", response);
      if (appendToHistory) {
        setChatHistory([
          ...updatedHistory,
          { role: "assistant", content: response },
        ]);
      }

      setText(response);
      return response;
    } catch (e) {
      console.error("Error sending to GPT:", e);
      Alert.alert("Error", "Failed to send to GPT.");
    }
  };

  const speakText = async (text: string) => {
    setAiSpeaking(true);
    try {
      // const response = await fetch("https://api.openai.com/v1/audio/speech", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`,
      //   },
      //   body: JSON.stringify({
      //     model: "tts-1",
      //     input: text,
      //     voice,
      //   }),
      // });

      // if (!response.ok) throw new Error("TTS request failed");

      // const arrayBuffer = await response.arrayBuffer();
      // const base64 = Buffer.from(arrayBuffer).toString("base64");
      // const fileUri = FileSystem.documentDirectory + "tts-speech.mp3";
      // await FileSystem.writeAsStringAsync(fileUri, base64, {
      //   encoding: FileSystem.EncodingType.Base64,
      // });
      const fileUri = await fetchTTS(text, voice);
      const { sound } = await Audio.Sound.createAsync({ uri: fileUri });
      ttsSoundRef.current = sound;

      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isPlaying && status.didJustFinish) {
          setAiSpeaking(false);
          setAllowContinue(true); // 允许继续对话
          sound.unloadAsync();
          ttsSoundRef.current = null;
        }
      });
    } catch (error) {
      console.error("TTS Error:", error);
      Alert.alert("Error", "Failed to speak via OpenAI TTS.");
      setAiSpeaking(false);
    }
  };

  const resetConversation = () => {
    setChatHistory([{ role: "system", content: "你是一个有帮助的语音助手。" }]);
    setText("");
    setAiResponse(null);
    stopSpeaking();
    setAllowContinue(false);
  };

  const stopSpeaking = async () => {
    setAiSpeaking(false);
    if (ttsSoundRef.current) {
      await ttsSoundRef.current.stopAsync();
      await ttsSoundRef.current.unloadAsync();
      ttsSoundRef.current = null;
    }
  };

  useEffect(() => {
    if (aiSpeaking) {
      lottieRef.current?.play();
    } else {
      lottieRef.current?.reset();
    }
  }, [aiSpeaking]);
  return (
    <LinearGradient
      colors={["#250152", "#000000"]}
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#131313",
      }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar barStyle="light-content" />
      <Image
        source={require("../assets/images/bour.png")}
        style={{
          width: scale(240),
          position: "absolute",
          top: 0,
          right: scale(-15),
        }}
      ></Image>
      <Image
        source={require("../assets/images/purple-bour.png")}
        style={{
          width: scale(210),
          position: "absolute",
          bottom: verticalScale(100),
          left: scale(-15),
        }}
      ></Image>

      <VoiceSettingModal voice={voice} setVoice={setVoice} />

      <View style={{ marginTop: verticalScale(-30) }}>
        {isLoading ? (
          <LoadingAnimation />
        ) : (
          <RecordButton
            isRecording={isRecording}
            aiSpeaking={aiSpeaking}
            allowContinue={allowContinue}
            startRecording={startRecording}
            stopRecording={stopRecording}
            lottieRef={lottieRef}
            setAllowContinue={setAllowContinue}
          />
        )}
      </View>

      <TextDisplay isLoading={isLoading} text={text} />

      <ControlButtons
        aiResponse={!!aiResponse}
        text={text}
        resetConversation={resetConversation}
        speakText={speakText}
        handleSendToGpt={() => handleSendToGpt("")}
      />
    </LinearGradient>
  );
}
