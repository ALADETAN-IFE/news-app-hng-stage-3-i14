import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  ActivityIndicator,
  Linking,
  useWindowDimensions,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useState, useEffect, useCallback } from "react";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { NewsroomArticle } from "../../../types";
import { fetchArticleById } from "../../../utils/api";
import {
  toggleSaveArticle,
  isArticleSaved,
} from "../../../utils/storage";
import Footer from "../../../components/Footer";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&q=80&w=800";

export default function ArticleDetailsScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 768;
  const { id: paramId, articleData } = useLocalSearchParams();

  const optimisticArticle: NewsroomArticle | null = (() => {
    try {
      return articleData ? JSON.parse(articleData as string) : null;
    } catch {
      return null;
    }
  })();

  const [article, setArticle] = useState<NewsroomArticle | null>(optimisticArticle);
  const [isSaved, setIsSaved] = useState(false);
  const [loadingBody, setLoadingBody] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [aiBriefOpen, setAiBriefOpen] = useState(true);
  const [evidenceOpen, setEvidenceOpen] = useState(false);
  const [communityCheckOpen, setCommunityCheckOpen] = useState(true);

  const articleId = paramId as string;

  useEffect(() => {
    if (!articleId) return;
    isArticleSaved(articleId).then(setIsSaved);
  }, [articleId]);

  useEffect(() => {
    AsyncStorage.getItem("userToken").then((token) => setIsLoggedIn(!!token));
  }, []);

  const fetchBody = useCallback(async () => {
    if (!articleId) return;
    const isGuardianId = articleId.includes("/");
    if (!isGuardianId) {
      setLoadingBody(false);
      return;
    }
    setLoadingBody(true);
    setError(null);
    try {
      const full = await fetchArticleById(articleId);
      if (full) setArticle(full);
    } catch {
      setError("Could not load the full article.");
    } finally {
      setLoadingBody(false);
    }
  }, [articleId]);

  useEffect(() => {
    fetchBody();
  }, [fetchBody]);

  const handleBookmark = async () => {
    if (!article) return;
    const nowSaved = await toggleSaveArticle(article);
    setIsSaved(nowSaved);
  };

  const handleOpenInBrowser = () => {
    if (article?.url) Linking.openURL(article.url);
  };

  if (!article) {
    return (
      <SafeAreaView className="flex-1 bg-[#0C0D0F] items-center justify-center">
        <ActivityIndicator color="#EE343B" size="large" />
        <Text className="text-[#9498A2] mt-3 text-[13px]">Loading article…</Text>
      </SafeAreaView>
    );
  }

  const formattedDate = new Date(article.publishedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const timeString = new Date(article.publishedAt).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <SafeAreaView className="flex-1 bg-[#0C0D0F]">
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-[#27292D] bg-[#0C0D0F] md:hidden">
        <Pressable
          onPress={() => router.back()}
          className="flex-row items-center gap-1.5"
        >
          <MaterialCommunityIcons name="arrow-left" size={22} color="#F0F2F5" />
        </Pressable>
        <View className="flex-row gap-1">
          <Pressable onPress={handleBookmark} className="p-2">
            <MaterialCommunityIcons
              name={isSaved ? "bookmark" : "bookmark-outline"}
              size={22}
              color={isSaved ? "#EE343B" : "#F0F2F5"}
            />
          </Pressable>
          <Pressable className="p-2">
            <MaterialCommunityIcons
              name="share-variant"
              size={22}
              color="#F0F2F5"
            />
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 0 }}>
        <View className="w-full mx-auto w-full pt-6 md:pt-10">
          {isLargeScreen && (
            <Pressable
              onPress={() => router.back()}
              className="flex-row items-center gap-2 mb-6 px-4"
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={16}
                color="#9498A2"
              />
              <Text className="text-[#9498A2] text-[11px] font-bold tracking-widest uppercase">
                BACK
              </Text>
            </Pressable>
          )}

          <View className="px-4 gap-4 mb-6">
            <View className="flex-row items-center gap-3">
              <View className="bg-[#EE343B] px-2 py-1 rounded-sm">
                <Text className="text-white text-[10px] font-bold tracking-widest uppercase">
                  {article.sectionName}
                </Text>
              </View>
              <View className="flex-row items-center gap-1">
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={12}
                  color="#9498A2"
                />
                <Text className="text-[#9498A2] text-[10px] font-bold tracking-widest uppercase">
                  ABOUT 12 HOURS AGO
                </Text>
              </View>
            </View>

            <Text className="text-[#F0F2F5] text-3xl md:text-4xl font-serif font-bold leading-tight">
              {article.title}
            </Text>

            {article.description && (
              <Text className="text-[#9498A2] text-base md:text-lg">
                {article.description}
              </Text>
            )}

            <Text className="text-[#9498A2] text-[10px] font-bold tracking-widest uppercase">
              PUBLISHED {formattedDate.toUpperCase()} -{" "}
              {timeString.toUpperCase()}
            </Text>
          </View>

          <Animated.View entering={FadeIn.duration(400)}>
            <View className="px-4 mb-6">
              <Image
                source={{ uri: article.image || FALLBACK_IMAGE }}
                className="w-full h-64 md:h-[400px] bg-[#15171B]"
                resizeMode="cover"
              />
            </View>
          </Animated.View>

          <View className="px-4 gap-8">
            <View className="border border-[#27292D] bg-[#111214] rounded overflow-hidden">
              <Pressable
                onPress={() => setAiBriefOpen(!aiBriefOpen)}
                className="flex-row items-center justify-between p-3 bg-[#15171B] border-b border-[#27292D]"
              >
                <View className="flex-row items-center gap-2">
                  <MaterialCommunityIcons
                    name="robot-outline"
                    size={16}
                    color="#EEB868"
                  />
                  <Text className="text-[#EEB868] text-[10px] font-bold tracking-widest uppercase">
                    AI BRIEF
                  </Text>
                  <Text className="text-[#9498A2] text-[10px] tracking-widest uppercase">
                    {" "}
                    • 10-SECOND READ
                  </Text>
                </View>
                <MaterialCommunityIcons
                  name={aiBriefOpen ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="#9498A2"
                />
              </Pressable>

              {aiBriefOpen && (
                <View className="p-4 gap-5">
                  <View className="gap-2">
                    <Text className="text-[#EE343B] text-[11px] font-bold tracking-widest uppercase">
                      TL;DR
                    </Text>
                    <View className="flex-row">
                      <Text className="text-[#F0F2F5] text-[14px] mr-2">•</Text>
                      <Text className="text-[#F0F2F5] text-[14px] leading-relaxed flex-1">
                        Key personnel changes during game development can
                        significantly impact a project&apos;s creative
                        direction.
                      </Text>
                    </View>
                    <View className="flex-row">
                      <Text className="text-[#F0F2F5] text-[14px] mr-2">•</Text>
                      <Text className="text-[#F0F2F5] text-[14px] leading-relaxed flex-1">
                        The game is now under new leadership following these
                        departures.
                      </Text>
                    </View>
                    <View className="flex-row">
                      <Text className="text-[#F0F2F5] text-[14px] mr-2">•</Text>
                      <Text className="text-[#F0F2F5] text-[14px] leading-relaxed flex-1">
                        Developers left to co-found an independent studio.
                      </Text>
                    </View>
                  </View>

                  <View className="gap-2">
                    <Text className="text-[#EEB868] text-[11px] font-bold tracking-widest uppercase">
                      WHY IT MATTERS
                    </Text>
                    <Text className="text-[#9498A2] text-[13px] leading-relaxed">
                      Leadership changes during game development can
                      significantly impact a project&apos;s creative direction,
                      development timeline, and overall success, potentially
                      affecting millions of fans and substantial investments.
                    </Text>
                  </View>

                  <View className="flex-row items-center justify-between border-t border-[#27292D] pt-3">
                    <View className="flex-row items-center gap-3">
                      <Pressable className="flex-row items-center gap-1">
                        <MaterialCommunityIcons
                          name="thumb-up-outline"
                          size={14}
                          color="#9498A2"
                        />
                      </Pressable>
                      <Pressable className="flex-row items-center gap-1">
                        <MaterialCommunityIcons
                          name="thumb-down-outline"
                          size={14}
                          color="#9498A2"
                        />
                      </Pressable>
                    </View>
                    <Text className="text-[#EE343B] text-[10px] font-bold tracking-widest uppercase">
                      REGENERATE
                    </Text>
                  </View>
                  <Text className="text-[#9498A2] text-[9px] uppercase tracking-widest">
                    AI generated · may contain errors. Powered by Lovable AI.
                  </Text>
                </View>
              )}
            </View>

            {loadingBody ? (
              <View className="items-center py-8">
                <ActivityIndicator color="#EE343B" />
              </View>
            ) : error ? (
              <Text className="text-[#9498A2] text-sm">{error}</Text>
            ) : (
              <Text
                className="text-[#F0F2F5] text-base leading-relaxed md:text-lg wrap-balance"
                numberOfLines={3}
              >
                {article.body ||
                  "The full article content is only available on the source website."}
              </Text>
            )}

            <View className="flex-row items-center gap-3 border-t border-[#27292D] pt-6 flex-wrap">
              <Pressable
                onPress={handleOpenInBrowser}
                className="bg-[#EE343B] flex-row items-center gap-2 px-4 py-2.5 rounded"
              >
                <MaterialCommunityIcons
                  name="open-in-new"
                  size={16}
                  color="white"
                />
                <Text className="text-white text-[11px] font-bold tracking-widest uppercase">
                  READ FULL ARTICLE
                </Text>
              </Pressable>
              <Pressable
                onPress={handleBookmark}
                className="border border-[#27292D] flex-row items-center gap-2 px-4 py-2.5 rounded"
              >
                <MaterialCommunityIcons
                  name={isSaved ? "bookmark" : "bookmark-outline"}
                  size={16}
                  color={isSaved ? "#EE343B" : "white"}
                />
                <Text className="text-white text-[11px] font-bold tracking-widest uppercase">
                  SAVE
                </Text>
              </Pressable>
              <Pressable className="border border-[#27292D] flex-row items-center gap-2 px-4 py-2.5 rounded">
                <MaterialCommunityIcons
                  name="share-variant"
                  size={16}
                  color="white"
                />
                <Text className="text-white text-[11px] font-bold tracking-widest uppercase">
                  SHARE
                </Text>
              </Pressable>
            </View>

            <Text className="text-[#9498A2] text-xs">
              Source:{" "}
              <Text className="underline text-[#F0F2F5]">The Guardian</Text>
            </Text>

            <View className="border border-[#27292D] bg-[#111214] rounded p-4 gap-4">
              <View className="flex-row items-center gap-2">
                <MaterialCommunityIcons
                  name="robot-outline"
                  size={16}
                  color="#EEB868"
                />
                <Text className="text-[#EEB868] text-[10px] font-bold tracking-widest uppercase">
                  ASK AI ABOUT THIS ARTICLE
                </Text>
                <View className="bg-[#EEB868]/10 px-1.5 py-0.5 rounded">
                  <Text className="text-[#EEB868] text-[9px] font-bold uppercase">
                    BETA
                  </Text>
                </View>
              </View>

              <Text className="text-[#9498A2] text-sm">
                The AI only has access to this article — it won&apos;t make up
                facts. Try:
              </Text>

              <View className="flex-row flex-wrap gap-2">
                {[
                  "Summarize this in one sentence.",
                  "What's missing from the story?",
                  "Who are the named sources?",
                  "How could I verify this?",
                ].map((chip) => (
                  <View
                    key={chip}
                    className="border border-[#27292D] bg-[#15171B] px-3 py-1.5 rounded-full"
                  >
                    <Text className="text-[#F0F2F5] text-[11px]">{chip}</Text>
                  </View>
                ))}
              </View>

              <View className="bg-[#0C0D0F] border border-[#27292D] rounded p-3 flex-row items-center justify-center gap-2">
                <MaterialCommunityIcons
                  name="lock-outline"
                  size={16}
                  color="#9498A2"
                />
                <Text className="text-[#9498A2] text-[13px]">
                  {isLoggedIn
                    ? "Ask the AI a question..."
                    : "Sign in to ask the AI"}
                </Text>
              </View>

              <View className="flex-row items-center gap-2">
                <MaterialCommunityIcons
                  name="alert-outline"
                  size={12}
                  color="#9498A2"
                />
                <Text className="text-[#9498A2] text-[10px] tracking-widest uppercase">
                  AI can be wrong. Cross-check before sharing.
                </Text>
              </View>
            </View>

            <View className="border border-[#27292D] bg-[#111214] rounded overflow-hidden">
              <Pressable
                onPress={() => setEvidenceOpen(!evidenceOpen)}
                className="flex-row items-center justify-between p-3 bg-[#15171B] border-b border-[#27292D]"
              >
                <View className="flex-row items-center gap-2">
                  <MaterialCommunityIcons
                    name="text-box-search-outline"
                    size={16}
                    color="#EEB868"
                  />
                  <Text className="text-[#F0F2F5] text-[10px] font-bold tracking-widest uppercase">
                    SUPPORTING EVIDENCE
                  </Text>
                  <Text className="text-[#9498A2] text-[10px] tracking-widest uppercase">
                    {" "}
                    0 ITEMS
                  </Text>
                </View>
                <MaterialCommunityIcons
                  name={evidenceOpen ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="#9498A2"
                />
              </Pressable>

              {evidenceOpen && (
                <View className="p-6 items-center justify-center gap-3">
                  {!isLoggedIn && (
                    <View className="flex-row items-center gap-2">
                      <MaterialCommunityIcons
                        name="login"
                        size={16}
                        color="#9498A2"
                      />
                      <Text className="text-[#9498A2] text-[13px]">
                        Sign in to add supporting facts
                      </Text>
                    </View>
                  )}
                  <Text className="text-[#9498A2] text-[13px] text-center">
                    No evidence yet. Be the first to add a source, image, or
                    note.
                  </Text>
                </View>
              )}
            </View>

            <View className="border border-[#27292D] bg-[#111214] rounded overflow-hidden mb-8">
              <Pressable
                onPress={() => setCommunityCheckOpen(!communityCheckOpen)}
                className="flex-row items-center justify-between p-3 bg-[#15171B] border-b border-[#27292D]"
              >
                <View className="flex-row items-center gap-2">
                  <MaterialCommunityIcons
                    name="check-decagram-outline"
                    size={16}
                    color="#EF4444"
                  />
                  <Text className="text-[#F0F2F5] text-[10px] font-bold tracking-widest uppercase">
                    COMMUNITY CHECK
                  </Text>
                  <Text className="text-[#9498A2] text-[10px] tracking-widest uppercase">
                    {" "}
                    2 COMMENTS
                  </Text>
                </View>
                {isLoggedIn ? (
                  <View className="flex-row items-center gap-2">
                    <View className="bg-[#22C55E]/10 border border-[#22C55E]/30 px-2 py-0.5 rounded flex-row items-center gap-1">
                      <MaterialCommunityIcons
                        name="check-circle"
                        size={10}
                        color="#22C55E"
                      />
                      <Text className="text-[#22C55E] text-[9px] font-bold tracking-widest uppercase">
                        LIKELY REAL
                      </Text>
                    </View>
                    <Text className="text-[#9498A2] text-[10px] tracking-widest uppercase">
                      {" "}
                      64 VOTES
                    </Text>
                  </View>
                ) : (
                  <Text className="text-[#9498A2] text-[10px] tracking-widest uppercase">
                    {" "}
                    NO VOTES YET
                  </Text>
                )}
              </Pressable>

              {communityCheckOpen && isLoggedIn ? (
                <View className="p-4 gap-6">
                  <View className="gap-2">
                    <View className="flex-row h-1.5 w-full bg-[#27292D] rounded-full overflow-hidden">
                      <View
                        className="bg-[#22C55E] h-full"
                        style={{ width: "89%" }}
                      />
                      <View
                        className="bg-[#EF4444] h-full"
                        style={{ width: "11%" }}
                      />
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-[#22C55E] text-[9px] font-bold tracking-widest uppercase">
                        89% REAL
                      </Text>
                      <Text className="text-[#EF4444] text-[9px] font-bold tracking-widest uppercase">
                        11% FAKE
                      </Text>
                    </View>
                  </View>

                  <View className="border border-[#27292D] bg-[#0C0D0F] rounded overflow-hidden">
                    <TextInput
                      placeholder="Your name"
                      placeholderTextColor="#9498A2"
                      className="border-b border-[#27292D] p-3 text-[#F0F2F5] text-sm"
                    />
                    <TextInput
                      placeholder="Add context, sources, or a fact-check..."
                      placeholderTextColor="#9498A2"
                      multiline
                      numberOfLines={3}
                      className="p-3 text-[#F0F2F5] text-sm h-20"
                      textAlignVertical="top"
                    />
                    <View className="p-2 flex-row justify-end">
                      <View className="bg-[#15171B] p-1.5 rounded-full border border-[#27292D]">
                        <MaterialCommunityIcons
                          name="image-outline"
                          size={16}
                          color="#9498A2"
                        />
                      </View>
                    </View>
                  </View>

                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-2">
                      <View className="w-3 h-3 border border-[#9498A2] rounded-sm" />
                      <Text className="text-[#9498A2] text-[11px]">
                        I&apos;m a verified reporter / expert
                      </Text>
                    </View>
                    <Pressable className="bg-[#EE343B] px-3 py-1.5 rounded">
                      <Text className="text-white text-[10px] font-bold tracking-widest uppercase">
                        POST COMMENT
                      </Text>
                    </Pressable>
                  </View>

                  <Text className="text-[#9498A2] text-[9px] tracking-widest uppercase">
                    Vote to verification, abuse-handling and precedence are
                    described in /docs/community-fact-check-api
                  </Text>

                  <View className="gap-6 border-t border-[#27292D] pt-6">
                    <View className="gap-2">
                      <View className="flex-row justify-between items-center">
                        <View className="flex-row items-center gap-2">
                          <Text className="text-[#F0F2F5] font-bold text-[13px]">
                            Maya R.
                          </Text>
                          <View className="bg-[#EEB868] px-1 py-0.5 rounded flex-row items-center gap-0.5">
                            <MaterialCommunityIcons
                              name="check-decagram"
                              size={10}
                              color="#0C0D0F"
                            />
                            <Text className="text-[#0C0D0F] text-[8px] font-bold uppercase">
                              VERIFIED
                            </Text>
                          </View>
                          <Text className="text-[#9498A2] text-[10px] uppercase tracking-widest">
                            REPORTER - THE STANDARD
                          </Text>
                        </View>
                        <Text className="text-[#9498A2] text-[10px] tracking-widest uppercase">
                          4 DAYS AGO
                        </Text>
                      </View>
                      <Text className="text-[#F0F2F5] text-[13px] leading-relaxed">
                        Cross-checked with two on-the-ground sources — the core
                        claim holds. The casualty figure is still developing.
                      </Text>
                      <View className="flex-row items-center gap-3 mt-1">
                        <View className="flex-row items-center gap-1">
                          <MaterialCommunityIcons
                            name="thumb-up-outline"
                            size={12}
                            color="#9498A2"
                          />
                          <Text className="text-[#9498A2] text-[10px]">
                            REAL • 34
                          </Text>
                        </View>
                        <View className="flex-row items-center gap-1">
                          <MaterialCommunityIcons
                            name="thumb-down-outline"
                            size={12}
                            color="#9498A2"
                          />
                          <Text className="text-[#9498A2] text-[10px]">
                            FAKE • 2
                          </Text>
                        </View>
                        <View className="flex-1 h-1 bg-[#27292D] rounded-full overflow-hidden ml-2">
                          <View
                            className="bg-[#22C55E] h-full"
                            style={{ width: "94%" }}
                          />
                        </View>
                      </View>
                    </View>

                    <View className="gap-2">
                      <View className="flex-row justify-between items-center">
                        <Text className="text-[#F0F2F5] font-bold text-[13px]">
                          alex_89
                        </Text>
                        <Text className="text-[#9498A2] text-[10px] tracking-widest uppercase">
                          4 DAYS AGO
                        </Text>
                      </View>
                      <Text className="text-[#F0F2F5] text-[13px] leading-relaxed">
                        The image in this story is from a 2019 event. Reverse
                        image search returns earlier results.
                      </Text>
                      <View className="flex-row items-center gap-3 mt-1">
                        <View className="flex-row items-center gap-1">
                          <MaterialCommunityIcons
                            name="thumb-up-outline"
                            size={12}
                            color="#9498A2"
                          />
                          <Text className="text-[#9498A2] text-[10px]">
                            REAL • 3
                          </Text>
                        </View>
                        <View className="flex-row items-center gap-1">
                          <MaterialCommunityIcons
                            name="thumb-down-outline"
                            size={12}
                            color="#9498A2"
                          />
                          <Text className="text-[#9498A2] text-[10px]">
                            FAKE • 11
                          </Text>
                        </View>
                        <View className="flex-1 h-1 bg-[#27292D] rounded-full overflow-hidden ml-2 flex-row">
                          <View
                            className="bg-[#22C55E] h-full"
                            style={{ width: "21%" }}
                          />
                          <View
                            className="bg-[#EF4444] h-full"
                            style={{ width: "79%" }}
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              ) : communityCheckOpen && !isLoggedIn ? (
                <View className="p-6 items-center justify-center gap-3">
                  <View className="flex-row items-center gap-2">
                    <MaterialCommunityIcons
                      name="login"
                      size={16}
                      color="#9498A2"
                    />
                    <Text className="text-[#9498A2] text-[13px]">
                      Sign in to post a comment or fact-check
                    </Text>
                  </View>
                  <Text className="text-[#9498A2] text-[13px] text-center">
                    Be the first to weigh in.
                  </Text>
                </View>
              ) : null}
            </View>
          </View>

          <Footer />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
