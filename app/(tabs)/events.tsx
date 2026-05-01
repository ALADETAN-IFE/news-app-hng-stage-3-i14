import { View, Text, ScrollView, Pressable, TextInput } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
export default function EventsScreen() {
  const [selectedLocation, setSelectedLocation] = useState("LAGOS , NIGERIA");
  const [selectedWhen, setSelectedWhen] = useState("ANY TIME");
  const [selectedType, setSelectedType] = useState("ALL");
  const [otherCity, setOtherCity] = useState("");
  const locations = [
    "LAGOS , NIGERIA",
    "ABUJA , NIGERIA",
    "NAIROBI , KENYA",
    "CAPE TOWN , SOUTH AFRICA",
    "ACCRA , GHANA",
  ];
  const whens = ["ANY TIME", "TODAY", "THIS WEEK", "THIS MONTH"];
  const types = [
    "ALL",
    "CONFERENCE",
    "MEETUP",
    "HACKATHON",
    "WORKSHOP",
    "SUMMIT",
  ];
  return (
    <SafeAreaView className="flex-1 bg-[#0C0D0F]">
      <View className="flex-1">
        <View className="flex-row items-center justify-between p-4 border-b border-[#222] md:hidden">
          <View className="flex-row items-center gap-2">
            <View className="bg-[#EE343B] rounded px-2 py-1">
              <Text className="text-white font-bold text-base">N</Text>
            </View>
            <View>
              <Text className="text-white font-bold text-base leading-tight">
                NEWSROOM
              </Text>
              <Text className="text-[#9498A2] text-[9px] tracking-widest leading-tight">
                LIVE WIRE
              </Text>
            </View>
          </View>
          <View className="flex-row gap-4">
            <MaterialCommunityIcons
              name="bell-outline"
              size={20}
              color="#9498A2"
            />
            <MaterialCommunityIcons
              name="login-variant"
              size={20}
              color="#9498A2"
            />
          </View>
        </View>
        <ScrollView className="flex-1 bg-[#0C0D0F]">
          <View className="p-4 border-b border-[#27292D]">
            <View className="flex-row items-center gap-2 mb-2">
              <MaterialCommunityIcons
                name="calendar-blank"
                size={12}
                color="#EE343B"
              />
              <Text className="text-[#EE343B] text-[10px] font-bold tracking-widest">
                TECH EVENTS
              </Text>
            </View>
            <Text className="text-white text-2xl font-bold mb-2 font-serif">
              What's happening in Lagos
            </Text>
            <Text className="text-[#9498A2] text-xs leading-relaxed">
              Upcoming tech conferences, hackathons, meetups, and developer
              events near you.
            </Text>
          </View>
          <View className="p-4 border-b border-[#222] gap-4">
            <Pressable className="flex-row items-center self-start gap-2 border border-[#333] px-3 py-2 rounded-sm bg-[#131417]">
              <MaterialCommunityIcons
                name="map-marker-outline"
                size={14}
                color="#F0F2F5"
              />
              <Text className="text-[#F0F2F5] text-[10px] tracking-widest font-bold">
                USE MY LOCATION
              </Text>
            </Pressable>
            <View className="flex-row flex-wrap gap-2">
              {locations.map((loc) => (
                <Pressable
                  key={loc}
                  onPress={() => setSelectedLocation(loc)}
                  className={`border rounded-sm px-3 py-2 ${selectedLocation === loc ? "border-[#EE343B]" : "border-[#333] bg-[#131417]"}`}
                >
                  <Text
                    className={`text-[10px] font-bold tracking-widest ${selectedLocation === loc ? "text-[#EE343B]" : "text-[#9498A2]"}`}
                  >
                    {loc}
                  </Text>
                </Pressable>
              ))}
            </View>
            <View className="flex-row gap-2">
              <TextInput
                className="flex-1 border border-[#333] bg-[#131417] text-white px-3 py-2 text-xs rounded-sm"
                placeholder="Other city..."
                placeholderTextColor="#666"
                value={otherCity}
                onChangeText={setOtherCity}
              />
              <Pressable className="bg-[#662222] px-4 py-2 rounded-sm justify-center">
                <Text className="text-[#EE343B] text-[10px] tracking-widest font-bold">
                  GO
                </Text>
              </Pressable>
            </View>
          </View>
          <View className="p-4 border-b border-[#222] gap-3">
            <View className="flex-row items-center gap-3 flex-wrap">
              <Text className="text-[#9498A2] text-[10px] tracking-widest font-bold">
                WHEN
              </Text>
              {whens.map((when) => (
                <Pressable
                  key={when}
                  onPress={() => setSelectedWhen(when)}
                  className={`border rounded-sm px-3 py-1.5 ${selectedWhen === when ? "border-[#EE343B] bg-[#331111]" : "border-[#333] bg-[#131417]"}`}
                >
                  <Text
                    className={`text-[10px] font-bold tracking-widest ${selectedWhen === when ? "text-[#EE343B]" : "text-[#9498A2]"}`}
                  >
                    {when}
                  </Text>
                </Pressable>
              ))}
            </View>
            <View className="flex-row items-center gap-3 flex-wrap">
              <Text className="text-[#9498A2] text-[10px] tracking-widest font-bold">
                TYPE
              </Text>
              {types.map((type) => (
                <Pressable
                  key={type}
                  onPress={() => setSelectedType(type)}
                  className={`border rounded-sm px-3 py-1.5 ${selectedType === type ? "border-[#EE343B] bg-[#331111]" : "border-[#333] bg-[#131417]"}`}
                >
                  <Text
                    className={`text-[10px] font-bold tracking-widest ${selectedType === type ? "text-[#EE343B]" : "text-[#9498A2]"}`}
                  >
                    {type}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
          <View className="flex-row items-center justify-end p-4 border-b border-[#222] gap-2">
            <MaterialCommunityIcons
              name="swap-vertical"
              size={14}
              color="#9498A2"
            />
            <Text className="text-[#9498A2] text-[10px] tracking-widest font-bold">
              SORT
            </Text>
            <View className="border border-[#333] bg-[#131417] px-3 py-1.5 rounded-sm flex-row items-center justify-between w-32">
              <Text className="text-white text-xs font-mono">Soonest</Text>
            </View>
          </View>
          <View className="p-4 mx-4 mt-4 border border-[#333] rounded-sm bg-[#131417] gap-4">
            <View className="flex-row items-center gap-2">
              <MaterialCommunityIcons
                name="filter-outline"
                size={14}
                color="#9498A2"
              />
              <Text className="text-[#9498A2] text-[10px] tracking-widest font-bold">
                FILTERS
              </Text>
            </View>
            <View className="flex-row flex-wrap gap-2">
              {types.map((type) => (
                <Pressable
                  key={type}
                  className={`border rounded-sm px-3 py-1.5 ${type === "ALL" ? "border-[#EE343B] bg-[#331111]" : "border-[#333] bg-[#131417]"}`}
                >
                  <Text
                    className={`text-[10px] font-bold tracking-widest ${type === "ALL" ? "text-[#EE343B]" : "text-[#9498A2]"}`}
                  >
                    {type}
                  </Text>
                </Pressable>
              ))}
            </View>
            <View className="flex-row items-center gap-3">
              <Text className="text-[#9498A2] text-[10px] tracking-widest font-bold">
                FROM
              </Text>
              <View className="border border-[#333] bg-[#131417] px-2 py-1.5 rounded-sm flex-row items-center justify-between flex-1">
                <Text className="text-white font-mono text-xs">mm/dd/yyyy</Text>
                <MaterialCommunityIcons
                  name="calendar-blank"
                  size={12}
                  color="#666"
                />
              </View>
              <Text className="text-[#9498A2] text-[10px] tracking-widest font-bold">
                TO
              </Text>
              <View className="border border-[#333] bg-[#131417] px-2 py-1.5 rounded-sm flex-row items-center justify-between flex-1">
                <Text className="text-white font-mono text-xs">mm/dd/yyyy</Text>
                <MaterialCommunityIcons
                  name="calendar-blank"
                  size={12}
                  color="#666"
                />
              </View>
            </View>
          </View>
          <View className="p-8 mx-4 mt-4 mb-4 border border-[#333] rounded-sm bg-[#131417] items-center gap-2">
            <MaterialCommunityIcons
              name="calendar-blank"
              size={32}
              color="#666"
            />
            <Text className="text-white font-bold text-base mt-2">
              No events match your filters
            </Text>
            <Text className="text-[#9498A2] text-xs text-center leading-relaxed">
              We couldn't find any tech events in{" "}
              <Text className="font-bold text-[#CCC]">Lagos</Text>. Try widening
              your filters or picking another city.
            </Text>
            <Pressable className="border border-[#333] bg-[#131417] flex-row items-center gap-2 px-4 py-2 rounded-sm mt-4">
              <MaterialCommunityIcons
                name="refresh"
                size={14}
                color="#9498A2"
              />
              <Text className="text-[#9498A2] text-[10px] font-bold tracking-widest">
                TRY AGAIN
              </Text>
            </Pressable>
          </View>
          <View className="p-4 border-t border-[#222]">
            <Text className="text-[#666] text-[10px] leading-relaxed">
              Events are surfaced from real news coverage and announcements
              (including mentions of Eventbrite, tix.africa, Lu.ma, and
              Meetup.com) via GNews. Always confirm dates and venues with the
              organizer before attending.
            </Text>
          </View>
          <View className="mx-4 my-4 h-[1px] bg-[#333]" />
          <View className="flex-row items-center justify-between px-4 pb-4">
            <Text className="text-[#666] text-[10px] font-mono">
              © 2026 NEWSROOM
            </Text>
            <Pressable className="flex-row items-center gap-2 bg-[#2A1111] px-3 py-2 rounded-sm">
              <MaterialCommunityIcons
                name="star-four-points"
                size={12}
                color="#EE343B"
              />
              <Text className="text-[#EE343B] text-[10px] tracking-widest font-bold">
                SELECT INTERESTS
              </Text>
            </Pressable>
          </View>
          <View className="items-center pb-8 pt-4">
            <Text className="text-[#666] text-[10px] tracking-widest font-mono">
              POWERED BY The Guardian
            </Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
