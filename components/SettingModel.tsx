import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import { LinearGradient } from "expo-linear-gradient";
import SettingIcon from "../assets/svgs/setting";
import { ScrollView } from "react-native";

interface VoiceSettingModalProps {
  voice: string;
  setVoice: (voice: string) => void;
}

const VoiceSettingModal: React.FC<VoiceSettingModalProps> = ({
  voice,
  setVoice,
}) => {
  const [showModal, setShowModal] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const openModal = () => {
    setShowModal(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setShowModal(false));
  };

  const voices = [
    "nova",
    "fable",
    "alloy",
    "ash",
    "coral",
    "echo",
    "onyx",
    "sage",
    "shimmer",
  ];

  return (
    <View
      style={{
        flexDirection: "row",
        position: "absolute",
        top: verticalScale(60),
        right: scale(25),
      }}
    >
      <TouchableOpacity onPress={openModal}>
        <SettingIcon size={scale(20)} color="#fff" />
      </TouchableOpacity>

      <Modal
        visible={showModal}
        transparent
        animationType="none"
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <LinearGradient
            colors={["#0f0f2f", "#1a1a3f"]}
            style={styles.modalOverlay}
          >
            <TouchableWithoutFeedback>
              <Animated.View
                style={[styles.modalContent, { opacity: fadeAnim }]}
              >
                <ScrollView showsVerticalScrollIndicator={false}>
                  {voices.map((v) =>
                    voice === v ? (
                      <LinearGradient
                        key={v}
                        colors={["#00ffff", "#ff00ff"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.optionActive}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            setVoice(v);
                            closeModal();
                          }}
                        >
                          <Text style={styles.optionTextActive}>{v}</Text>
                        </TouchableOpacity>
                      </LinearGradient>
                    ) : (
                      <TouchableOpacity
                        key={v}
                        onPress={() => {
                          setVoice(v);
                          closeModal();
                        }}
                        style={styles.option}
                      >
                        <Text style={styles.optionText}>{v}</Text>
                      </TouchableOpacity>
                    )
                  )}
                </ScrollView>
              </Animated.View>
            </TouchableWithoutFeedback>
          </LinearGradient>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#1e1e2e",
    padding: 20,
    borderRadius: 12,
    width: "80%",
    height: scale(260),
    borderWidth: 1,
    borderColor: "#44f",
    shadowColor: "#0ff",
    shadowOpacity: 0.6,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  option: {
    backgroundColor: "#333",
    padding: 12,
    borderRadius: 8,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#444", // 边框
  },
  optionText: {
    color: "#fff",
    textAlign: "center",
  },
  optionActive: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 5,
    borderWidth: 3,
    borderColor: "transparent", // 透明边框
    backgroundColor: "transparent", // 透明背景
    position: "relative", // 保证流光效果显示
  },
  optionTextActive: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default VoiceSettingModal;
