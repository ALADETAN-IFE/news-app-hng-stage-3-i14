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

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleReset = () => {
    if (email.trim() === "") return;
    setSubmitted(true);
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
              Reset Password
            </Text>
            <Text
              className="text-[#999] text-sm"
            >
              Enter your email address and we'll send you instructions to
              reset your password.
            </Text>
          </View>
          {!submitted ? (
            <View className="gap-6">
              <TextInput
                placeholder="Email Address"
                placeholderTextColor="#9498A2"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                className="bg-[#0C0D0F] border-b border-[#EF4444] py-4 px-4 text-white text-base"
              />
              <Pressable
                onPress={handleReset}
                className="bg-[#EF4444] rounded py-4 items-center mt-2 active:opacity-80"
              >
                <Text className="text-white font-bold text-base tracking-wider uppercase">
                  Send Reset Link
                </Text>
              </Pressable>
              <View className="flex-row justify-center gap-2">
                <Text className="text-[#9498A2] text-sm">
                  Remember your password?
                </Text>
                <Pressable
                  onPress={() => router.push("/auth/signin")}
                  className="active:opacity-70"
                >
                  <Text className="text-[#EE343B] text-sm font-bold">
                    Sign In
                  </Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <View className="items-center py-12">
              <View className="w-16 h-16 rounded-full bg-[#EE343B] items-center justify-center mb-6">
                <MaterialCommunityIcons
                  name="check"
                  size={32}
                  color="#F0F2F5"
                />
              </View>
              <Text className="text-[#F0F2F5] text-2xl font-bold text-center mb-2">
                Check your email
              </Text>
              <Text className="text-[#9498A2] text-sm text-center mb-8 px-4">
                We&apos;ve sent password reset instructions to {email}
              </Text>
              <Pressable
                onPress={() => router.push("/auth/signin")}
                className="bg-[#EE343B] rounded px-6 py-3 active:opacity-80"
              >
                <Text className="text-[#F0F2F5] font-bold text-sm">
                  BACK TO SIGN IN
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>
      <View className="border-t border-[#27292D] px-4 py-6 bg-[#0C0D0F]">
        <Text className="text-[#666] text-xs text-center">
          © {new Date().getFullYear()} NEWSROOM
        </Text>
      </View>
    </SafeAreaView>
  );
}
