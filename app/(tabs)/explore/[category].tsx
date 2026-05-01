import {
  View,
  Text,
  Pressable,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { useEffect, useState, useCallback } from "react";
import { NewsroomArticle } from "../../../types";
import { fetchBySection } from "../../../utils/api";
import { toggleSaveArticle } from "../../../utils/storage";
import { CATEGORY_TO_GUARDIAN_SECTION } from "../../../utils/constants";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&q=80&w=800";

export default function ExploreDetailScreen() {
  const router = useRouter();
  const { category: paramCategory } = useLocalSearchParams();
  const category = (paramCategory as string) || "technology";
  const [articles, setArticles] = useState<NewsroomArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const loadArticles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const section =
        CATEGORY_TO_GUARDIAN_SECTION[category.toLowerCase()] ??
        category.toLowerCase();
      const data = await fetchBySection(section);
      setArticles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load articles.");
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  const handleBookmark = async (article: NewsroomArticle) => {
    const nowSaved = await toggleSaveArticle(article);
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (nowSaved) next.add(article.id);
      else next.delete(article.id);
      return next;
    });
  };

  const handleArticlePress = (article: NewsroomArticle) => {
    router.push({
      pathname: "/(tabs)/article/[id]",
      params: { id: article.id, articleData: JSON.stringify(article) },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0C0D0F]">
      <View className="bg-[#0C0D0F] border-b border-[#27292D]">
        <View className="px-4 py-4 border-b border-[#27292D]">
          <Pressable
            onPress={() => router.back()}
            className="flex-row items-center gap-1.5 mb-4"
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={22}
              color="#F0F2F5"
            />
            <Text className="text-[#9498A2] text-[13px]">Back</Text>
          </Pressable>
          <View className="flex-row items-center gap-2 mb-3">
            <View className="bg-[#EE343B] rounded px-2 py-1">
              <Text className="text-[#F0F2F5] font-bold text-lg">N</Text>
            </View>
            <Text className="text-[#F0F2F5] font-bold text-lg">NEWSROOM</Text>
          </View>
          <Text className="text-[#F0F2F5] text-[28px] font-bold capitalize">
            {category}
          </Text>
        </View>
      </View>
      {loading ? (
        <View className="flex-1 items-center justify-center gap-3">
          <ActivityIndicator color="#EE343B" size="large" />
          <Text className="text-[#9498A2] text-[13px]">
            Loading {category} articles…
          </Text>
        </View>
      ) : error ? (
        <Animated.View
          entering={FadeIn.duration(300)}
          className="m-4 p-4 bg-[#15171B] border border-[#27292D] gap-2"
        >
          <Text className="text-[#F0F2F5] font-semibold text-sm">
            Could not load articles
          </Text>
          <Text className="text-[#9498A2] text-[13px]">{error}</Text>
          <Pressable
            onPress={loadArticles}
            className="self-start bg-[#EE343B] px-4 py-2 rounded mt-1"
          >
            <Text className="text-[#F0F2F5] font-bold text-[11px]">RETRY</Text>
          </Pressable>
        </Animated.View>
      ) : (
        <FlatList
          data={articles}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <Animated.View
              entering={FadeInDown.delay(index * 55)
                .duration(380)
                .springify()}
            >
              <Pressable
                onPress={() => handleArticlePress(item)}
                className="px-4 py-3.5 border-b border-[#27292D] flex-row gap-3"
              >
                <View className="relative">
                  <Image
                    source={{ uri: item.image || FALLBACK_IMAGE }}
                    className="w-24 h-24 bg-[#15171B] rounded"
                    resizeMode="cover"
                  />
                  <Pressable
                    onPress={() => handleBookmark(item)}
                    className="absolute bottom-1 right-1 bg-black/80 p-1 rounded"
                  >
                    <MaterialCommunityIcons
                      name={
                        savedIds.has(item.id) ? "bookmark" : "bookmark-outline"
                      }
                      size={14}
                      color={savedIds.has(item.id) ? "#EE343B" : "#F0F2F5"}
                    />
                  </Pressable>
                </View>
                <View className="flex-1 justify-between">
                  <View className="gap-1.5">
                    <View className="bg-[#EE343B] self-start rounded px-2 py-1">
                      <Text className="text-[#F0F2F5] text-[9px] font-bold uppercase tracking-wider">
                        {item.sectionName}
                      </Text>
                    </View>
                    <Text
                      className="text-[#F0F2F5] text-sm font-bold leading-tight"
                      numberOfLines={3}
                    >
                      {item.title}
                    </Text>
                    <Text className="text-[#9498A2] text-[11px]">
                      {new Date(item.publishedAt).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              </Pressable>
            </Animated.View>
          )}
          ListEmptyComponent={
            <View className="items-center py-16 gap-2">
              <MaterialCommunityIcons
                name="newspaper-remove"
                size={48}
                color="#9498A2"
              />
              <Text className="text-[#F0F2F5] text-base font-semibold">
                No articles in this category
              </Text>
            </View>
          }
          ListFooterComponent={
            <View className="px-4 py-6 border-t border-[#27292D] items-center">
              <Text className="text-[#9498A2] text-xs">
                © {new Date().getFullYear()} NEWSROOM
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
