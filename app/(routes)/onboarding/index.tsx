import React from "react";
import { View, Text, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import OnBoardingOne from "@/assets/svgs/onBoardingOne";

export default function OnBoarding() {
  return (
    <LinearGradient
      colors={["#250152", "#000000"]}
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar barStyle="light-content" />
      <OnBoardingOne />
    </LinearGradient>
  );
}
