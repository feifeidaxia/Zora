// LoadingAnimation.tsx
import React from "react";
import LottieView from "lottie-react-native";
import { scale } from "react-native-size-matters";
const loadingAnimation = require("../assets/animations/loading.json");

const LoadingAnimation: React.FC = () => (
  <LottieView
    source={loadingAnimation}
    autoPlay
    loop
    speed={1.3}
    style={{
      width: scale(270),
      height: scale(270),
    }}
  />
);

export default LoadingAnimation;
