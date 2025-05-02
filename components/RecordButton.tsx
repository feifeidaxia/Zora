// RecordButton.tsx
import React from "react";
import { TouchableOpacity,View } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import LottieView from "lottie-react-native";
import { scale } from "react-native-size-matters";

const startRecorgAnimation = require("../assets/animations/startRecorg.json");
const playAnimation = require("../assets/animations/play.json");

interface RecordButtonProps {
  isRecording: boolean;
  aiSpeaking: boolean;
  allowContinue: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  lottieRef: React.RefObject<LottieView>;
  setAllowContinue: React.Dispatch<React.SetStateAction<boolean>>;
}

const RecordButton: React.FC<RecordButtonProps> = ({
  isRecording,
  aiSpeaking,
  allowContinue,
  startRecording,
  stopRecording,
  lottieRef,
  setAllowContinue,
}) => {
  return (
    <>
      {!isRecording ? (
        <>
          {aiSpeaking ? (
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
              />
            </View>
          ) : allowContinue ? (
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
              onPress={() => {
                setAllowContinue(false);
                startRecording();
              }}
            >
              <FontAwesome name="microphone" size={scale(50)} color="#2b3356" />
            </TouchableOpacity>
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
              <FontAwesome name="microphone" size={scale(50)} color="#2b3356" />
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
          />
        </TouchableOpacity>
      )}
    </>
  );
};

export default RecordButton;
