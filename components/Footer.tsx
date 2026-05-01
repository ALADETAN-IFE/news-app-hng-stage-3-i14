import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import ExploreModal from "./ExploreModal";

export default function Footer() {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <View className="border-t border-[#27292D] bg-[#0C0D0F] px-4 py-8 mt-4">
        <View className="flex-row items-center justify-between mb-8 max-w-4xl mx-auto w-full">
          <Text className="text-[#9498A2] text-xs font-semibold tracking-widest uppercase">
            © {new Date().getFullYear()} NEWSROOM
          </Text>
          <Pressable
            onPress={() => setModalVisible(true)}
            className="flex-row items-center gap-1.5 bg-[#EE343B]/10 px-3 py-2 rounded active:opacity-70"
          >
            <MaterialCommunityIcons name="star-four-points-outline" size={14} color="#EE343B" />
            <Text className="text-[#F0F2F5] text-xs font-bold tracking-widest uppercase">
              SELECT INTERESTS
            </Text>
          </Pressable>
        </View>
        <Text className="text-[#9498A2] text-[10px] text-center font-bold tracking-[0.2em] uppercase">
          POWERED BY The Guardian
        </Text>
      </View>
      <ExploreModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
}
