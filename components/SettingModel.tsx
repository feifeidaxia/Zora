import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import SettingIcon from "../assets/svgs/setting"; // 确保引入你写的图标组件

interface VoiceSettingModalProps {
  voice: string;
  setVoice: (voice: string) => void;
}

const VoiceSettingModal: React.FC<VoiceSettingModalProps> = ({
  voice,
  setVoice,
}) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <View>
      {/* 设置按钮，点击后弹出 Modal */}
      <TouchableOpacity onPress={() => setShowModal(true)}>
        <SettingIcon size={scale(20)} color="#fff" />
      </TouchableOpacity>

      {/* Modal 弹窗 */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {["nova", "fable", "alloy", "shimmer"].map((v) => (
              <TouchableOpacity
                key={v}
                onPress={() => {
                  setVoice(v);
                  setShowModal(false);
                }}
                style={{
                  padding: 12,
                  backgroundColor: voice === v ? "#fff" : "#444",
                  marginVertical: 5,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: voice === v ? "#000" : "#fff" }}>
                  {v}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#222",
    padding: 20,
    borderRadius: 12,
    width: "80%",
  },
});

export default VoiceSettingModal;
