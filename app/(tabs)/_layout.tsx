import { Tabs, useRouter, usePathname } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Pressable, Text, View, useWindowDimensions } from "react-native";
import { useState, useEffect, ComponentProps } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ExploreModal from "../../components/ExploreModal";
import {
  TAB_ITEMS,
  APP_BG,
  APP_BORDER,
  APP_TEXT,
  APP_TEXT_MUTED,
  APP_RED,
} from "../../utils/constants";
import { loadSavedInterests } from "../../utils/storage";
import { useKeyboardShortcuts } from "@/utils/useKeyboardShortcuts";

type IconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

export default function TabsLayout() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 768;
  const [showExplore, setShowExplore] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useKeyboardShortcuts();

  useEffect(() => {
    loadSavedInterests().then((savedInterests) => {
      if (!savedInterests.length) {
        setShowExplore(true);
      }
    });
    AsyncStorage.getItem("userToken").then((token) => {
      setIsLoggedIn(!!token);
    });
  }, []);

  const handleAuthAction = async () => {
    if (isLoggedIn) {
      await AsyncStorage.removeItem("userToken");
      setIsLoggedIn(false);
      router.replace("/");
    } else {
      router.push("/auth/signin");
    }
  };

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: isLargeScreen,
          header: () => (
            <View
              className="flex-row items-center justify-between px-6 border-b border-[#27292D] bg-[#0C0D0F]"
              style={{ height: 64 }}
            >
              <Pressable onPress={() => router.push("/(tabs)/feeds")} className="flex-row items-center gap-2">
                <View className="bg-[#EE343B] rounded px-2 py-1">
                  <Text className="text-[#F0F2F5] font-bold text-xl">N</Text>
                </View>
                <View>
                  <Text className="text-[#F0F2F5] font-bold text-[17px] leading-tight">
                    NEWSROOM
                  </Text>
                  <Text className="text-[#9498A2] text-[9px] tracking-widest font-bold">
                    LIVE WIRE
                  </Text>
                </View>
              </Pressable>

              <View className="flex-row items-center gap-8">
                {TAB_ITEMS.map((tabMeta) => {
                  const isActive = pathname.includes(tabMeta.name);
                  return (
                    <Pressable
                      key={tabMeta.name}
                      onPress={() => router.push(`/(tabs)/${tabMeta.name}` as any)}
                      className="p-2"
                    >
                      <MaterialCommunityIcons
                        name={(isActive ? tabMeta.activeIcon : tabMeta.icon) as IconName}
                        size={22}
                        color={isActive ? "#F0F2F5" : "#9498A2"}
                      />
                    </Pressable>
                  );
                })}
              </View>

              <View className="flex-row items-center gap-4">
                <Pressable className="p-2">
                  <MaterialCommunityIcons name="bell-outline" size={22} color="#9498A2" />
                </Pressable>
                <Pressable onPress={handleAuthAction} className="border border-[#27292D] rounded p-2 flex-row items-center justify-center">
                  <MaterialCommunityIcons
                    name={isLoggedIn ? "logout" : "login"}
                    size={18}
                    color="#9498A2"
                  />
                </Pressable>
              </View>
            </View>
          ),
          sceneStyle: { backgroundColor: APP_BG },
        }}
        tabBar={({ state, descriptors, navigation }) => (
          <View
            style={{
              display: isLargeScreen ? "none" : "flex",
              backgroundColor: APP_BG,
              borderTopWidth: !isLargeScreen ? 1 : 0,
              borderBottomWidth: isLargeScreen ? 1 : 0,
              borderTopColor: APP_BORDER,
              borderBottomColor: APP_BORDER,
              paddingHorizontal: isLargeScreen ? 24 : 0,
              paddingVertical: 12,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: isLargeScreen ? "flex-start" : "space-between",
                gap: isLargeScreen ? 32 : 8,
                width: "100%",
                borderRadius: isLargeScreen ? 0 : 12,
                paddingHorizontal: isLargeScreen ? 0 : 8,
              }}
            >
              {TAB_ITEMS.map((tabMeta) => {
                const route = state.routes.find((r) => r.name === tabMeta.name);
                if (!route) return null;
                const isFocused = state.index === state.routes.indexOf(route);
                const isHovered = hoveredIndex === TAB_ITEMS.indexOf(tabMeta);
                const onPress = () => {
                  const event = navigation.emit({
                    type: "tabPress",
                    target: route.key,
                    canPreventDefault: true,
                  });
                  if (!isFocused && !event.defaultPrevented) {
                    navigation.navigate(route.name, route.params);
                  }
                };
                return (
                  <Pressable
                    key={tabMeta.name}
                    accessibilityRole="button"
                    accessibilityState={isFocused ? { selected: true } : {}}
                    accessibilityLabel={
                      descriptors[route.key].options.tabBarAccessibilityLabel
                    }
                    testID={descriptors[route.key].options.tabBarButtonTestID}
                    onPress={onPress}
                    onLongPress={() =>
                      navigation.emit({
                        type: "tabLongPress",
                        target: route.key,
                      })
                    }
                    onHoverIn={() =>
                      setHoveredIndex(TAB_ITEMS.indexOf(tabMeta))
                    }
                    onHoverOut={() => setHoveredIndex(null)}
                    style={{
                      flex: 1,
                      height: isLargeScreen ? 64 : 84,
                      paddingHorizontal: isLargeScreen ? 16 : 0,
                      paddingVertical: isLargeScreen ? 8 : 0,
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 5,
                      borderBottomWidth: isFocused ? 2 : 0,
                      borderBottomColor: isFocused ? APP_RED : "transparent",
                    }}
                  >
                    <MaterialCommunityIcons
                      name={
                        (isFocused || isHovered
                          ? tabMeta.activeIcon
                          : tabMeta.icon) as IconName
                      }
                      size={20}
                      color={isFocused || isHovered ? APP_TEXT : APP_TEXT_MUTED}
                    />
                    {isLargeScreen ? (
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: "700",
                          letterSpacing: 0.5,
                          color:
                            isFocused || isHovered ? APP_TEXT : APP_TEXT_MUTED,
                        }}
                      >
                        {tabMeta.label}
                      </Text>
                    ) : (
                      <Text
                        style={{
                          fontSize: 9,
                          fontWeight: "700",
                          letterSpacing: 0.5,
                          marginTop: 4,
                          color: isFocused ? APP_TEXT : APP_TEXT_MUTED,
                        }}
                      >
                        {tabMeta.label}
                      </Text>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}
      >
        <Tabs.Screen
          name="feeds"
          options={{
            title: "Feeds",
          }}
        />
        <Tabs.Screen
          name="events"
          options={{
            title: "Events",
          }}
        />
        <Tabs.Screen name="search" options={{ title: "Search" }} />
        <Tabs.Screen
          name="saved"
          options={{
            title: "Saved",
          }}
        />
      </Tabs>
      <ExploreModal
        visible={showExplore}
        onClose={() => setShowExplore(false)}
      />
    </>
  );
}
