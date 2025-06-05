import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import * as React from "react";

// 本地封面图（1080x1920）
const SplashImage = require("../assets/images/splash.jpg");

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isReady, setIsReady] = useState(false);

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    RobotFont: require("../assets/fonts/RobotoCondensed-Bold.ttf"),
    SegoeUi: require("../assets/fonts/SegoeUI.ttf"),
  });

  useEffect(() => {
    async function prepare() {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 模拟加载
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (loaded && isReady) {
      SplashScreen.hideAsync(); // 隐藏系统 splash
    }
  }, [loaded, isReady]);

  if (!loaded || !isReady) {
    // ✅ 自定义 splash 显示（全屏背景图）
    return (
      <View style={styles.container}>
        <ImageBackground
          source={SplashImage}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="home" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0f2c",
  },
  image: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
