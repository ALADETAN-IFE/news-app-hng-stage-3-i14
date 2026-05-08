import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
  DeviceEventEmitter,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { COUNTRY_OPTIONS, EXPLORE_INTERESTS } from "../utils/constants";
import {
  clearSavedInterests,
  loadSavedInterests,
  saveInterests,
} from "../utils/storage";
type Props = {
  visible: boolean;
  onClose: () => void;
};
export default function ExploreModal({ visible, onClose }: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const [customInterest, setCustomInterest] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const categories =
    EXPLORE_INTERESTS.categories ?? EXPLORE_INTERESTS.CATEGORIES ?? [];
  const interests =
    EXPLORE_INTERESTS.interests ?? EXPLORE_INTERESTS.INTERESTS ?? [];
  const selectedCountryLabel = useMemo(
    () =>
      COUNTRY_OPTIONS.find((item) => item.value === selectedCountry)?.label ??
      "Any country",
    [selectedCountry],
  );
  useEffect(() => {
    if (visible) {
      loadSavedInterests().then((saved) => {
        setSelected(saved);
      });
    }
  }, [visible]);
  const toggle = (cat: string) => {
    setSelected((prev) =>
      prev.includes(cat) ? prev.filter((p) => p !== cat) : [...prev, cat],
    );
  };
  const save = async () => {
    const value = customInterest.trim().toLowerCase();
    const nextSelected = value
      ? selected.includes(value)
        ? selected
        : [...selected, value]
      : selected;
    await saveInterests(nextSelected);
    // await saveInterests([]);
    DeviceEventEmitter.emit("interestsChanged", nextSelected);
    onClose();
  };
  const skip = async () => {
    await clearSavedInterests();
    onClose();
  };
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 justify-end bg-black/70">
        <View className="max-h-[88%] rounded-t-2xl border-t border-[#27292D] bg-[#0C0D0F]">
          <View className="border-b border-[#27292D] px-4 py-4">
            <View className="flex-row items-start justify-between gap-4">
              <View className="flex-1 gap-2">
                <Text className="text-xs font-bold uppercase tracking-[0.28em] text-[#EE343B]">
                  Personalize
                </Text>
                <Text className="text-[28px] font-bold leading-8 text-[#F0F2F5]">
                  Make this newsroom yours
                </Text>
                <Text className="text-sm leading-5 text-[#9498A2]">
                  Pick your interests and we&apos;ll tailor the feed. Skip
                  anytime — you can reopen this from the header.
                </Text>
              </View>
              <Pressable
                onPress={onClose}
                className="rounded-full p-2 active:opacity-70"
              >
                <MaterialCommunityIcons
                  name="close"
                  size={20}
                  color="#F0F2F5"
                />
              </Pressable>
            </View>
          </View>
          <ScrollView
            contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
          >
            <Text className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-[#9498A2]">
              Categories
            </Text>
            <View className="flex-row flex-wrap gap-2 border-b border-[#27292D] pb-4">
              {categories.map((category) => {
                const active = selected.includes(
                  category.toLowerCase().split(" ").map(word=> word.charAt(0).toUpperCase() + word.slice(1)).join(" "),
                );
                return (
                  <Pressable
                    key={category}
                    onPress={() =>
                      toggle(category.toLowerCase().split(" ").map(word=> word.charAt(0).toUpperCase() + word.slice(1)).join(" "))
                    }
                    className={`border px-3 py-2 ${active ? "border-[#EE343B] bg-[#1C1D21]" : "border-[#27292D] bg-transparent"}`}
                  >
                    <Text
                      className={`text-xs font-semibold ${active ? "text-[#F0F2F5]" : "text-[#9498A2]"}`}
                    >
                      {category}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <Text className="mb-3 mt-5 text-xs font-bold uppercase tracking-[0.28em] text-[#9498A2]">
              Hobbies, Work &amp; Topics
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {interests.map((interest) => {
                const active = selected.includes(interest.category);
                return (
                  <Pressable
                    key={interest.category}
                    onPress={() => toggle(interest.category)}
                    className={`border px-3 py-2 ${active ? "border-[#EE343B] bg-[#1C1D21]" : "border-[#27292D] bg-transparent"}`}
                  >
                    <Text
                      className={`text-xs ${active ? "text-[#F0F2F5]" : "text-[#9498A2]"}`}
                    >
                      {interest.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <View className="mt-4 flex-row gap-2">
              <TextInput
                value={customInterest}
                onChangeText={setCustomInterest}
                placeholder="Add your own (e.g. SaaS, Yoga, Anime)"
                placeholderTextColor="#9498A2"
                className="flex-1 border border-[#27292D] bg-[#0C0D0F] px-4 py-3 text-sm text-[#F0F2F5]"
              />
              <Pressable
                onPress={() => {
                  const value = customInterest.trim().toLowerCase();
                  if (!value) {
                    return;
                  }
                  setSelected((prev) =>
                    prev.includes(value) ? prev : [...prev, value],
                  );
                  setCustomInterest("");
                }}
                className="w-14 items-center justify-center border border-[#27292D] bg-[#0C0D0F] active:opacity-70"
              >
                <Text className="text-2xl leading-6 text-[#F0F2F5]">+</Text>
              </Pressable>
            </View>
            <Text className="mb-3 mt-5 text-xs font-bold uppercase tracking-[0.28em] text-[#9498A2]">
              Geography
            </Text>
            <Pressable
              onPress={() =>
                setSelectedCountry((current) =>
                  current === "any" ? "nigeria" : "any",
                )
              }
              className="border border-[#27292D] bg-[#0C0D0F] px-4 py-3 active:opacity-80"
            >
              <Text className="text-sm text-[#F0F2F5]">
                {selectedCountryLabel}
              </Text>
            </Pressable>
            <View className="mt-8 flex-row items-center justify-between border-t border-[#27292D] pt-6">
              <Pressable onPress={skip} className="active:opacity-70">
                <Text className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9498A2]">
                  Skip for now
                </Text>
              </Pressable>
              <Pressable
                onPress={save}
                className="bg-[#EE343B] px-5 py-4 active:opacity-80"
              >
                <Text className="text-sm font-bold uppercase tracking-[0.18em] text-[#F0F2F5]">
                  Save Preferences
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
