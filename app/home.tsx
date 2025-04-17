import { Buffer } from "buffer";
global.Buffer = global.Buffer || Buffer;
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import {
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as Haptics from "expo-haptics";
import { Audio } from "expo-av";
import axios from "axios";
import LottieView from "lottie-react-native";
import * as Speech from "expo-speech";
import Regenerate from "../assets/svgs/regenerate";
import Onload from "../assets/svgs/onload";
import * as FileSystem from "expo-file-system";

const startSound = require("../assets/sounds/start.mp3");
const endSound = require("../assets/sounds/end.mp3");
const startRecorgAnimation = require("../assets/animations/startRecorg.json");
const loadingAnimation = require("../assets/animations/loading.json");
const playAnimation = require("../assets/animations/play.json");

export default function HomeScreen() {
  const [isRecording, setIsRecording] = React.useState(false);
  const [recording, setRecording] = React.useState<Audio.Recording>();
  const [aiResponse, setAiResponse] = React.useState<boolean | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [text, setText] = React.useState("");
  const [aiSpeaking, setAiSpeaking] = React.useState(false);
  const [voice, setVoice] = React.useState("nova"); // 可选 alloy/echo/fable/onyx/shimmer
  const [userTranscript, setUserTranscript] = React.useState("");
  const lottieRef = React.useRef<LottieView>(null);

  const playSoundAndVibrate = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);

    const { sound } = await Audio.Sound.createAsync(
      isRecording ? endSound : startSound
    );
    await sound.playAsync();
  };

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
    playSoundAndVibrate();
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
      playSoundAndVibrate();

      await recording.stopAndUnloadAsync();
      await recording.getStatusAsync();
      await recording._cleanupForUnloadedRecorder(); // 可选但推荐清理
      const uri = recording.getURI();
      setRecording(undefined); // 清空状态

      if (!uri) {
        throw new Error("Recording URI not available");
      }

      const transcript = await sendAudioToAi(uri);
      setText(transcript);
      setUserTranscript(transcript);
      const gptResponse = await sendToGpt(transcript);
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

  const sendAudioToAi = async (uri: string) => {
    try {
      const formData: any = new FormData();
      formData.append("file", {
        uri,
        name: "recording.wav",
        type: "audio/wav",
      });
      formData.append("model", "whisper-1"); // Assuming the model is required
      const response = await axios.post(
        "https://api.openai.com/v1/audio/transcriptions",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`, // Replace with your actual API key
          },
        }
      );
      console.log("AI Response:", response.data.text);
      return response.data.text;
    } catch (error) {
      console.error("Error sending audio to AI:", error);
      Alert.alert("Error", "Failed to send audio to AI.");
    } finally {
      setIsLoading(false);
    }
  };

  const sendToGpt = async (text: string) => {
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: text }],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`, // Replace with your actual API key
            "Content-Type": "application/json",
          },
        }
      );
      console.log("GPT Response:", response.data.choices[0].message.content);
      setText(response.data.choices[0].message.content);
      setIsLoading(false);
      return response.data.choices[0].message.content;
    } catch (e) {
      console.error("Error sending to GPT:", e);
      Alert.alert("Error", "Failed to send to GPT.");
    }
  };

  const speakText = async (text: string) => {
    setAiSpeaking(true);
    try {
      const response = await fetch("https://api.openai.com/v1/audio/speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "tts-1",
          input: text,
          voice: voice, // "nova", "fable", etc.
        }),
      });

      if (!response.ok) throw new Error("TTS request failed");

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64 = buffer.toString("base64");

      const fileUri = FileSystem.documentDirectory + "tts-speech.mp3";
      await FileSystem.writeAsStringAsync(fileUri, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const { sound } = await Audio.Sound.createAsync({ uri: fileUri });
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isPlaying && status.didJustFinish) {
          setAiSpeaking(false);
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.error("TTS Error:", error);
      Alert.alert("Error", "Failed to speak via OpenAI TTS.");
      setAiSpeaking(false);
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

      <View style={{ marginTop: verticalScale(-30) }}>
        {isLoading ? (
          <TouchableOpacity>
            <LottieView
              source={loadingAnimation}
              autoPlay
              loop
              speed={1.3}
              style={{
                width: scale(270),
                height: scale(270),
              }}
            ></LottieView>
          </TouchableOpacity>
        ) : (
          <>
            {!isRecording ? (
              <>
                {aiResponse ? (
                  <View>
                    <LottieView
                      ref={lottieRef}
                      source={playAnimation}
                      autoPlay={false}
                      loop={false}
                      style={{
                        width: scale(250),
                        height: scale(250),
                      }}
                    ></LottieView>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={{
                      width: scale(110),
                      height: scale(110),
                      borderRadius: scale(100),
                      backgroundColor: "#fff",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "row",
                    }}
                    onPress={startRecording}
                  >
                    <FontAwesome
                      name="microphone"
                      size={scale(50)}
                      color="#2b3356"
                    ></FontAwesome>
                  </TouchableOpacity>
                )}
              </>
            ) : (
              <TouchableOpacity onPress={stopRecording}>
                <LottieView
                  source={startRecorgAnimation}
                  autoPlay
                  loop
                  speed={0.8}
                  style={{
                    width: scale(210),
                    height: scale(210),
                    borderRadius: scale(100),
                  }}
                ></LottieView>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>

      <View
        style={{
          position: "absolute",
          alignItems: "center",
          width: scale(350),
          bottom: verticalScale(110),
        }}
      >
        <Text
          style={{
            fontSize: scale(14),
            color: "#fff",
            width: scale(269),
            textAlign: "center",
            lineHeight: 25,
          }}
        >
          {isLoading
            ? "..."
            : text || "Press the microphone to start recording"}
        </Text>
      </View>
      {aiResponse && (
        <View
          style={{
            position: "absolute",
            bottom: verticalScale(56),
            left: 0,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: scale(360),
            paddingHorizontal: scale(35),
          }}
        >
          <TouchableOpacity onPress={() => sendToGpt(userTranscript)}>
            <Regenerate />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => text && speakText(text)}>
            <Onload />
          </TouchableOpacity>
        </View>
      )}

      <View
        style={{
          flexDirection: "row",
          position: "absolute",
          top: verticalScale(60),
        }}
      >
        {["nova", "fable", "alloy", "shimmer"].map((v) => (
          <TouchableOpacity
            key={v}
            style={{
              marginHorizontal: 5,
              backgroundColor: voice === v ? "#fff" : "#444",
              padding: 10,
              borderRadius: 10,
            }}
            onPress={() => setVoice(v)}
          >
            <Text style={{ color: voice === v ? "#000" : "#fff" }}>{v}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </LinearGradient>
  );
}
