import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ExploreModal from "@/components/ExploreModal";

export default function SignUpScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const handleSignUp = async () => {
    try {
      await AsyncStorage.setItem("userToken", "newsroom-auth-token");
      router.replace("/(tabs)/feeds");
    } catch (error) {
      console.error("Failed to sign up", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0C0D0F]">
      <ScrollView
        className="flex-1 bg-[#0C0D0F]"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="px-4 py-6">
          <Pressable
            onPress={() => router.back()}
            className="mb-4 active:opacity-70 w-max"
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color="#F0F2F5"
            />
          </Pressable>
          <View className="flex-row items-center gap-2">
            <View className="bg-[#EF4444] rounded px-2 py-1">
              <Text className="text-white font-bold text-lg">N</Text>
            </View>
            <Text className="text-white font-bold text-lg">NEWSROOM</Text>
          </View>
        </View>

        <View
          className="bg-[#15171B] mx-4 rounded-lg px-6 py-8 gap-6 mb-6 md:max-w-lg md:mx-auto md:w-full"
        >
          <View>
            <Text
              className="text-white text-3xl font-serif font-bold mb-2"
            >
              Sign Up
            </Text>
            <Text
              className="text-[#999] text-sm"
            >
              Create your account to get personalized news and save articles.
            </Text>
          </View>
          <View className="gap-6">
            <TextInput
              placeholder="Full Name"
              placeholderTextColor="#9498A2"
              value={name}
              onChangeText={setName}
              className="bg-[#0C0D0F] border-b border-[#EF4444] py-4 px-4 text-white text-base"
            />
            <TextInput
              placeholder="Email"
              placeholderTextColor="#9498A2"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              className="bg-[#0C0D0F] border-b border-[#EF4444] py-4 px-4 text-white text-base"
            />
            <View className="flex-row items-center bg-[#0C0D0F] border-b border-[#EF4444]">
              <TextInput
                placeholder="Password"
                placeholderTextColor="#9498A2"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                className="flex-1 py-4 px-4 text-white text-base"
              />
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                className="p-4"
              >
                <MaterialCommunityIcons
                  name={showPassword ? "eye" : "eye-off"}
                  size={20}
                  color="#9498A2"
                />
              </Pressable>
            </View>
            <View className="flex-row items-center bg-[#0C0D0F] border-b border-[#EF4444]">
              <TextInput
                placeholder="Confirm Password"
                placeholderTextColor="#9498A2"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                className="flex-1 py-4 px-4 text-white text-base"
              />
              <Pressable
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                className="p-4"
              >
                <MaterialCommunityIcons
                  name={showConfirmPassword ? "eye" : "eye-off"}
                  size={20}
                  color="#9498A2"
                />
              </Pressable>
            </View>
          </View>
          <Pressable
            onPress={() => setAgreeTerms(!agreeTerms)}
            className="flex-row items-center gap-3 py-2"
          >
            <View
              className={`w-5 h-5 rounded border items-center justify-center ${agreeTerms ? "bg-transparent border-[#999]" : "bg-transparent border-[#999]"
                }`}
            >
              {agreeTerms && (
                <MaterialCommunityIcons name="check" size={16} color="#999" />
              )}
            </View>
            <Text className="text-[#CCC] text-sm">
              I agree to Terms and Conditions
            </Text>
          </Pressable>
          <Pressable
            onPress={handleSignUp}
            disabled={!agreeTerms}
            className={`${agreeTerms ? "bg-[#EF4444]" : "bg-[#333]"
              } rounded py-4 items-center mt-2 active:opacity-80`}
          >
            <Text
              className={`font-bold text-base tracking-wider uppercase ${agreeTerms ? "text-white" : "text-[#666]"
                }`}
            >
              Create Account
            </Text>
          </Pressable>
          <View className="flex-row justify-center gap-2 mt-2">
            <Text className="text-[#999] text-sm">
              Already have an account?
            </Text>
            <Pressable
              onPress={() => router.push("/auth/signin")}
              className="active:opacity-70"
            >
              <Text className="text-[#EF4444] text-sm font-bold">Sign In</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
      <View className="border-t border-[#27292D] px-4 py-6 bg-[#0C0D0F]">
        <Pressable className="flex-row items-center justify-between">
          <Text className="text-[#666] text-xs">
            © {new Date().getFullYear()} NEWSROOM
          </Text>
          <Pressable
            onPress={() => setModalVisible(true)}
            className="active:opacity-70"
          >
            <Text className="text-[#EF4444] text-xs font-bold">
              SELECT INTERESTS
            </Text>
          </Pressable>
        </Pressable>
      </View>
      <ExploreModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
}
