// TextDisplay.tsx
import React from "react";
import { View, Text, ScrollView } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";

interface TextDisplayProps {
  isLoading: boolean;
  text: string;
}

const TextDisplay: React.FC<TextDisplayProps> = ({ isLoading, text }) => (
  <View
    style={{
      position: "absolute",
      alignItems: "center",
      width: scale(350),
      bottom: verticalScale(110),
    }}
  >
    <ScrollView
      style={{
        height: verticalScale(120),
        width: scale(269),
      }}
      contentContainerStyle={{
        alignItems: "center",
        justifyContent: "center",
      }}
      showsVerticalScrollIndicator={true}
    >
      <Text
        style={{
          fontSize: scale(14),
          color: "#fff",
          textAlign: "center",
          lineHeight: 25,
        }}
      >
        {isLoading ? "..." : text || "Press the microphone to start recording"}
      </Text>
    </ScrollView>
  </View>
);

export default TextDisplay;
