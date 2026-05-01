import { View, Text, ScrollView, Pressable, FlatList } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useState } from "react";
import { useRouter } from "expo-router";
import {
  APP_BG,
  APP_BORDER,
  APP_TEXT,
  APP_TEXT_MUTED,
  APP_RED,
  EXPLORE_INTERESTS,
  COUNTRY_OPTIONS,
} from "../../utils/constants";
import { InterestItem } from "../../types";

type ExploreItem = { type: "header" } | ({ type: "interest" } & InterestItem);

export default function ExploreScreen() {
  const router = useRouter();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState("any");

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest],
    );
  };

  const handleCategoryPress = (category: string) => {
    router.push({
      pathname: "/explore/[category]",
      params: { category: category.toLowerCase() },
    });
  };

  const data: ExploreItem[] = [
    { type: "header" },
    ...(EXPLORE_INTERESTS.interests || []).map((i) => ({
      type: "interest" as const,
      ...i,
    })),
  ];

  return (
    <View style={{ flex: 1, backgroundColor: APP_BG }}>
      <FlatList
        data={data}
        keyExtractor={(item, idx) => idx.toString()}
        ListHeaderComponent={
          <View>
            <View
              style={{
                paddingHorizontal: 16,
                paddingVertical: 16,
                borderBottomWidth: 1,
                borderBottomColor: APP_BORDER,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 16,
                }}
              >
                <View
                  style={{
                    backgroundColor: APP_RED,
                    borderRadius: 4,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                  }}
                >
                  <Text
                    style={{
                      color: APP_TEXT,
                      fontWeight: "bold",
                      fontSize: 18,
                    }}
                  >
                    N
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: APP_TEXT,
                      fontWeight: "bold",
                      fontSize: 18,
                    }}
                  >
                    NEWSROOM
                  </Text>
                  <Text style={{ color: APP_TEXT_MUTED, fontSize: 12 }}>
                    LIVE WIRE
                  </Text>
                </View>
                <Pressable style={{ padding: 8 }}>
                  <MaterialCommunityIcons
                    name="magnify"
                    size={24}
                    color={APP_TEXT_MUTED}
                  />
                </Pressable>
              </View>
            </View>
            <View
              style={{
                paddingHorizontal: 16,
                paddingVertical: 24,
                borderBottomWidth: 1,
                borderBottomColor: APP_BORDER,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: APP_TEXT,
                      fontSize: 20,
                      fontWeight: "bold",
                      marginBottom: 8,
                    }}
                  >
                    Make this newsroom yours
                  </Text>
                  <Text style={{ color: APP_TEXT_MUTED, fontSize: 14 }}>
                    Pick your interests and we&apos;ll customize your feeds. You
                    can change these anytime.
                  </Text>
                </View>
                <Pressable style={{ padding: 8 }}>
                  <MaterialCommunityIcons
                    name="close"
                    size={20}
                    color={APP_TEXT_MUTED}
                  />
                </Pressable>
              </View>
            </View>
            <View
              style={{
                paddingHorizontal: 16,
                paddingVertical: 16,
                borderBottomWidth: 1,
                borderBottomColor: APP_BORDER,
              }}
            >
              <Text
                style={{
                  color: APP_TEXT,
                  fontWeight: "bold",
                  fontSize: 12,
                  marginBottom: 12,
                }}
              >
                CATEGORIES
              </Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {(EXPLORE_INTERESTS.categories || [])?.map((cat) => (
                  <Pressable
                    key={cat}
                    onPress={() => handleCategoryPress(cat)}
                    style={{
                      backgroundColor: APP_BORDER,
                      borderRadius: 4,
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                    }}
                  >
                    <Text
                      style={{
                        color: APP_TEXT,
                        fontSize: 12,
                        fontWeight: "bold",
                      }}
                    >
                      {cat}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
            <View
              style={{
                paddingHorizontal: 16,
                paddingVertical: 16,
                borderBottomWidth: 1,
                borderBottomColor: APP_BORDER,
              }}
            >
              <Text
                style={{ color: APP_TEXT, fontWeight: "bold", fontSize: 12 }}
              >
                INTERESTS
              </Text>
            </View>
          </View>
        }
        renderItem={({ item }) =>
          item.type === "interest" ? (
            <Pressable
              onPress={() => toggleInterest(item.category)}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: APP_BORDER,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{ color: APP_TEXT, fontWeight: "600", fontSize: 14 }}
              >
                {item.label}
              </Text>
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 4,
                  borderWidth: 2,
                  alignItems: "center",
                  justifyContent: "center",
                  borderColor: selectedInterests.includes(
                    item.category,
                  )
                    ? APP_RED
                    : "#333333",
                  backgroundColor: selectedInterests.includes(
                    item.category,
                  )
                    ? APP_RED
                    : "transparent",
                }}
              >
                {selectedInterests.includes(item.category) && (
                  <MaterialCommunityIcons
                    name="check"
                    size={16}
                    color={APP_TEXT}
                  />
                )}
              </View>
            </Pressable>
          ) : null
        }
        ListFooterComponent={
          <View
            style={{
              paddingHorizontal: 16,
              paddingVertical: 24,
              gap: 16,
              borderTopWidth: 1,
              borderTopColor: APP_BORDER,
            }}
          >
            <View>
              <Text
                style={{
                  color: APP_TEXT,
                  fontWeight: "bold",
                  fontSize: 12,
                  marginBottom: 12,
                }}
              >
                Add your own country
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}
              >
                {COUNTRY_OPTIONS.map((country) => (
                  <Pressable
                    key={country.value}
                    onPress={() => setSelectedCountry(country.value)}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      borderRadius: 4,
                      backgroundColor:
                        selectedCountry === country.value
                          ? APP_RED
                          : APP_BORDER,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "bold",
                        color:
                          selectedCountry === country.value
                            ? APP_TEXT
                            : APP_TEXT_MUTED,
                      }}
                    >
                      {country.label}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
            <Pressable
              style={{
                backgroundColor: APP_RED,
                borderRadius: 4,
                paddingVertical: 12,
                alignItems: "center",
              }}
            >
              <Text
                style={{ color: APP_TEXT, fontWeight: "bold", fontSize: 14 }}
              >
                SAVE INTERESTS
              </Text>
            </Pressable>
            <Text
              style={{
                color: APP_TEXT_MUTED,
                fontSize: 12,
                textAlign: "center",
                marginTop: 8,
              }}
            >
              © {new Date().getFullYear()} NEWSROOM
            </Text>
          </View>
        }
      />
    </View>
  );
}
