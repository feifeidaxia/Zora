import React, { useState } from "react";
import {
  View,
  Text,
  StatusBar,
  ScrollView,
  StyleSheet,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import OnBoardingOne from "@/assets/svgs/onBoardingOne";
import OnBoardingTwo from "@/assets/svgs/onBoardingTwo";
import OnBoardingThree from "@/assets/svgs/onBoardingThree";
import { onBoardingData } from "@/configs/constans";
import { scale } from "react-native-size-matters";

export default function OnBoarding() {
  const [activeIndex, setActiveIndex] = useState(0);
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.floor(
      contentOffsetX / event.nativeEvent.layoutMeasurement.width
    );
    setActiveIndex(currentIndex);
  };
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
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
      >
        {onBoardingData.map((item: OnBoardingDataType, index: number) => (
          <View key={item.id} style={style.slide}>
            {item.image}
            <Text style={style.title}>{item.title}</Text>
            <Text>{item.description}</Text>
          </View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}

const style = StyleSheet.create({
  slide: {
    width: Dimensions.get("window").width,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: scale(24),
    fontWeight: "500",
    color: "white",
  },
});
