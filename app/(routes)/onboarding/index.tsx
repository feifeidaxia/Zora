import React, { useState } from "react";
import { router } from "expo-router";
import {
  View,
  Text,
  StatusBar,
  ScrollView,
  StyleSheet,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { onBoardingData } from "@/configs/constans";
import { scale, verticalScale } from "react-native-size-matters";
import AntDesign from "@expo/vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function OnBoarding() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = React.useRef<ScrollView>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.floor(
      contentOffsetX / event.nativeEvent.layoutMeasurement.width
    );
    setActiveIndex(currentIndex);
  };

  const handleIndicatorPress = (index: number) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: index * Dimensions.get("window").width,
        animated: true,
      });
      setActiveIndex(index);
    }
  };

  const handleSkip = async () => {
    const nextIndex = activeIndex + 1;
    if (nextIndex < onBoardingData.length) {
      scrollViewRef.current?.scrollTo({
        x: nextIndex * Dimensions.get("window").width,
        animated: true,
      });
      setActiveIndex(nextIndex);
    } else {
      // Navigate to the next screen
      await AsyncStorage.setItem("onboarding", "true");
      router.push("/(routes)/home");
    }
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
      <Pressable style={style.skipContainer} onPress={handleSkip}>
        <Text style={style.skip}>Skip</Text>
        <AntDesign name="arrowright" size={scale(16)} color="white" />
      </Pressable>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {onBoardingData.map((item: OnBoardingDataType, index: number) => (
          <View key={item.id} style={style.slide}>
            {item.image}
            <Text style={style.title}>{item.title}</Text>
            <Text style={style.description}>{item.description}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={style.indicatorContainer}>
        {onBoardingData.map((_, index: number) => (
          <TouchableOpacity
            key={index}
            style={[
              style.indicator,
              activeIndex === index && style.activeIndicator,
            ]}
            onPress={() => handleIndicatorPress(index)}
          />
        ))}
      </View>
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
    fontSize: scale(19),
    color: "white",
    fontFamily: "RobotFont",
  },
  description: {
    width: scale(250),
    marginHorizontal: "auto",
    fontSize: scale(12),
    color: "#9A9999",
    fontFamily: "SegoeUi",
    textAlign: "center",
    marginTop: scale(10),
  },
  indicatorContainer: {
    flexDirection: "row",
    position: "absolute",
    bottom: scale(100),
  },
  indicator: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(5),
    backgroundColor: "#9A9999",
    marginHorizontal: scale(8),
  },
  activeIndicator: {
    backgroundColor: "white",
  },
  skipContainer: {
    position: "absolute",
    top: verticalScale(50),
    right: scale(30),
    flexDirection: "row",
    alignItems: "center",
    gap: scale(5),
    zIndex: 1,
  },
  skip: {
    fontSize: scale(12),
    color: "white",
    fontFamily: "SegoeUi",
    fontWeight: "400",
  },
});
