import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Pressable,
  TextInput,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import { useEffect, useMemo, useState } from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { NewsroomArticle } from "../../types";
import { searchGuardianArticles } from "../../utils/api";
import { toggleSaveArticle } from "../../utils/storage";
import Footer from "../../components/Footer";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&q=80&w=800";

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [articles, setArticles] = useState<NewsroomArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const resultsLabel = useMemo(() => {
    if (loading) return "Searching…";
    if (!query.trim()) return "Enter a keyword to search";
    return `${articles.length} result${articles.length !== 1 ? "s" : ""} for "${query.trim()}"`;
  }, [articles.length, query, loading]);

  useEffect(() => {
    let isMounted = true;
    const timer = setTimeout(async () => {
      if (!query.trim()) {
        setArticles([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await searchGuardianArticles(query);
        if (isMounted) setArticles(response);
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "Unable to load results.",
          );
          setArticles([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }, 450);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [query]);

  const handleBookmark = async (article: NewsroomArticle) => {
    const nowSaved = await toggleSaveArticle(article);
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (nowSaved) next.add(article.id);
      else next.delete(article.id);
      return next;
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0C0D0F]">
      <View className="border-b border-[#27292D] px-4 py-4 gap-4">
        <View className="flex-row items-center justify-between md:hidden">
          <View className="flex-row items-center gap-2">
            <View className="bg-[#EE343B] rounded px-2 py-1">
              <Text className="text-[#F0F2F5] font-bold text-lg">N</Text>
            </View>
            <Text className="text-[#F0F2F5] font-bold text-lg leading-tight">
              NEWSROOM
            </Text>
          </View>
          <Text className="text-[#9498A2] text-[11px] tracking-widest">
            SEARCH
          </Text>
        </View>
        <Text className="text-[#F0F2F5] text-2xl font-bold">Find articles</Text>
        <View className="flex-row items-center border border-[#EE343B] bg-[#0B0C0E] px-3 py-3">
          <MaterialCommunityIcons name="magnify" size={18} color="#9498A2" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search news by keyword…"
            placeholderTextColor="#9498A2"
            className="flex-1 ml-2 text-sm text-[#F0F2F5]"
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery("")} className="p-1">
              <MaterialCommunityIcons name="close" size={18} color="#9498A2" />
            </Pressable>
          )}
        </View>
        <Text className="text-[#9498A2] text-[11px] tracking-widest uppercase">
          {resultsLabel}
        </Text>
      </View>
      {error ? (
        <Animated.View
          entering={FadeIn.duration(300)}
          className="m-4 p-4 bg-[#15171B] border border-[#27292D] gap-2"
        >
          <Text className="text-[#F0F2F5] font-semibold text-sm">
            Could not load results
          </Text>
          <Text className="text-[#9498A2] text-[13px]">{error}</Text>
          <Pressable
            onPress={() => setQuery((q) => q || "latest")}
            className="self-start bg-[#EE343B] px-4 py-2 rounded mt-1"
          >
            <Text className="text-[#F0F2F5] font-bold text-[11px] tracking-wider">
              RETRY
            </Text>
          </Pressable>
        </Animated.View>
      ) : null}
      <FlatList
        data={articles}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          loading ? (
            <View className="items-center py-16 gap-3">
              <ActivityIndicator color="#EE343B" size="large" />
              <Text className="text-[#9498A2] text-[13px]">
                Loading articles…
              </Text>
            </View>
          ) : query.trim() ? (
            <View className="items-center py-16 gap-2">
              <MaterialCommunityIcons
                name="newspaper-remove"
                size={48}
                color="#9498A2"
              />
              <Text className="text-[#F0F2F5] text-base font-semibold">
                No results found
              </Text>
              <Text className="text-[#9498A2] text-[13px] text-center">
                Try a different keyword
              </Text>
            </View>
          ) : (
            <View className="items-center py-16 gap-2">
              <MaterialCommunityIcons
                name="magnify"
                size={48}
                color="#9498A2"
              />
              <Text className="text-[#9498A2] text-sm">
                Type a keyword to start searching
              </Text>
            </View>
          )
        }
        contentContainerStyle={{ padding: 16, paddingBottom: 0 }}
        ListFooterComponent={<Footer />}
        renderItem={({ item, index }) => (
          <Animated.View
            entering={FadeInDown.delay(index * 50)
              .duration(350)
              .springify()}
          >
            <Pressable className="mb-4 border border-[#27292D] bg-[#15171B] overflow-hidden">
              <View className="relative">
                <Image
                  source={{ uri: item.image || FALLBACK_IMAGE }}
                  className="w-full h-44 md:h-64 lg:h-72 bg-[#15171B]"
                  resizeMode="cover"
                />
                <Pressable
                  onPress={() => handleBookmark(item)}
                  className="absolute top-2.5 right-2.5 bg-black/80 p-2 rounded"
                >
                  <MaterialCommunityIcons
                    name={
                      savedIds.has(item.id) ? "bookmark" : "bookmark-outline"
                    }
                    size={18}
                    color={savedIds.has(item.id) ? "#EE343B" : "#F0F2F5"}
                  />
                </Pressable>
              </View>
              <View className="p-3 gap-1.5">
                <View className="flex-row items-center gap-2">
                  <Text className="text-[#EE343B] text-[10px] font-bold tracking-widest uppercase">
                    {item.sectionName}
                  </Text>
                  <Text className="text-[#9498A2] text-[10px]">
                    {new Date(item.publishedAt).toLocaleDateString()}
                  </Text>
                </View>
                <Text
                  className="text-[#F0F2F5] text-[15px] font-bold leading-snug"
                  numberOfLines={3}
                >
                  {item.title}
                </Text>
                {item.description ? (
                  <Text
                    className="text-[#9498A2] text-[13px] leading-tight"
                    numberOfLines={2}
                  >
                    {item.description}
                  </Text>
                ) : null}
              </View>
            </Pressable>
          </Animated.View>
        )}
      />
    </SafeAreaView>
  );
}
