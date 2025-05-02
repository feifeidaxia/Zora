// utils/haptics.ts
import * as Haptics from "expo-haptics";
import { Audio } from "expo-av";

const startSound = require("../assets/sounds/start.mp3");
const endSound = require("../assets/sounds/end.mp3");

export const playSoundAndVibrate = async (isRecording: Boolean) => {
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
    const { sound } = await Audio.Sound.createAsync(
      isRecording ? endSound : startSound
    );
    await sound.playAsync();
  } catch (error) {
    console.error("Error playing sound or haptic:", error);
  }
};
