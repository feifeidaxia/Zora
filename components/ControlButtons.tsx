// ControlButtons.tsx
import React from "react";
import { View, TouchableOpacity } from "react-native";
import Onload from "../assets/svgs/onload";
import Regenerate from "../assets/svgs/regenerate";
import StopCircleIcon from "../assets/svgs/stop";
import { scale, verticalScale } from "react-native-size-matters";

interface ControlButtonsProps {
  aiResponse: boolean;
  text: string | null;
  resetConversation: () => void;
  speakText: (text: string) => void;
  handleSendToGpt: () => void;
}

const ControlButtons: React.FC<ControlButtonsProps> = ({
  aiResponse,
  text,
  resetConversation,
  speakText,
  handleSendToGpt,
}) => {
  return (
    aiResponse && (
      <View
        style={{
          position: "absolute",
          bottom: verticalScale(58),
          left: 0,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: scale(360),
          paddingHorizontal: scale(45),
        }}
      >
        <TouchableOpacity onPress={() => handleSendToGpt()}>
          <Onload />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => text && speakText(text)}>
          <Regenerate />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => resetConversation()}>
          <StopCircleIcon size={scale(33)} color="white" strokeWidth={2.5} />
        </TouchableOpacity>
      </View>
    )
  );
};

export default ControlButtons;
