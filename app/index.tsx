import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WelcomeScreen() {
  const router = useRouter();
  return (
    <SafeAreaView
      className="flex-1 w-full"
      style={{ backgroundColor: "#0C0D0F" }}
    >
      <View className="pt-6 pb-8 px-4" style={{ backgroundColor: "#0C0D0F" }}>
        <View className="flex-row items-center gap-2">
          <View
            className="rounded px-2 py-1"
            style={{ backgroundColor: "#EE343B" }}
          >
            <Text className="font-bold text-lg" style={{ color: "#F0F2F5" }}>
              N
            </Text>
          </View>
          <Text className="font-bold text-xl" style={{ color: "#F0F2F5" }}>
            NEWSROOM
          </Text>
        </View>
        <Text className="text-xs mt-1" style={{ color: "#9498A2" }}>
          LIVE WIRE
        </Text>
      </View>
      <View
        className="flex-1 px-4 py-8 justify-center md:max-w-lg md:mx-auto w-full"
      >
        <View className="mb-12">
          <Text
            className="text-4xl font-bold mb-4"
            style={{ color: "#F0F2F5" }}
          >
            Stay Updated
          </Text>
          <Text className="text-base leading-6" style={{ color: "#9498A2" }}>
            Get the latest news from around the world in one place. Read, save,
            and share stories that matter to you.
          </Text>
        </View>
        <View className="gap-6 mb-12">
          <View className="flex-row gap-4">
            <MaterialCommunityIcons
              name="newspaper"
              size={28}
              color="#EE343B"
            />
            <View className="flex-1">
              <Text className="font-semibold mb-1" style={{ color: "#F0F2F5" }}>
                Latest News
              </Text>
              <Text className="text-sm" style={{ color: "#9498A2" }}>
                Browse trending stories
              </Text>
            </View>
          </View>
          <View className="flex-row gap-4">
            <MaterialCommunityIcons name="bookmark" size={28} color="#EE343B" />
            <View className="flex-1">
              <Text className="font-semibold mb-1" style={{ color: "#F0F2F5" }}>
                Save Articles
              </Text>
              <Text className="text-sm" style={{ color: "#9498A2" }}>
                Keep your favorites
              </Text>
            </View>
          </View>
          <View className="flex-row gap-4">
            <MaterialCommunityIcons name="magnify" size={28} color="#EE343B" />
            <View className="flex-1">
              <Text className="font-semibold mb-1" style={{ color: "#F0F2F5" }}>
                Search Stories
              </Text>
              <Text className="text-sm" style={{ color: "#9498A2" }}>
                Find articles by keyword
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View
        className="pb-8 gap-3 md:max-w-lg md:mx-auto w-full"
      >
        <Pressable
          onPress={() => router.replace("/(tabs)/feeds")}
          className="rounded-lg py-3 items-center active:opacity-80 w-full md:w-[32rem]"
          style={{ backgroundColor: "#EE343B" }}
        >
          <Text className="font-bold text-base" style={{ color: "#F0F2F5" }}>
            Get Started
          </Text>
        </Pressable>
        <Pressable
          onPress={() => router.push("/auth/signin")}
          className="rounded-lg py-3 items-center active:opacity-80 w-full md:w-[32rem]"
          style={{ borderWidth: 1, borderColor: "#27292D" }}
        >
          <Text
            className="font-semibold text-base"
            style={{ color: "#F0F2F5" }}
          >
            Sign In
          </Text>
        </Pressable>
      </View>
      <View
        className="px-4 py-4 md:w-[32rem] md:mx-auto w-full"
        style={{
          borderTopWidth: 1,
          borderTopColor: "#27292D",
          backgroundColor: "#0C0D0F",
        }}
      >
        <Text className="text-xs text-center" style={{ color: "#9498A2" }}>
          © {new Date().getFullYear()} NEWSROOM
        </Text>
      </View>
    </SafeAreaView>
  );
}
