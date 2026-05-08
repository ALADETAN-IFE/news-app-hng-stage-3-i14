import {
  View,
  Text,
  Pressable,
  Image,
  FlatList,
  RefreshControl,
  DeviceEventEmitter,
} from "react-native";
import { useRouter } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useState, useEffect, useCallback, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
} from "react-native-reanimated";
import { Category, NewsroomArticle } from "../../types";
import { fetchBySection } from "../../utils/api";
import { toggleSaveArticle, loadSavedInterests, loadSavedArticles } from "../../utils/storage";
import {
  CATEGORY_TO_GUARDIAN_SECTION,
  EXPLORE_INTERESTS,
} from "../../utils/constants";
import Footer from "../../components/Footer";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&q=80&w=800";

function SkeletonCard({ featured = false }: { featured?: boolean }) {
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.9, { duration: 700 }),
        withTiming(0.4, { duration: 700 })
      ),
      -1,
      true
    );
  }, [opacity]);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  if (featured) {
    return (
      <Animated.View className="mb-6" style={animStyle}>
        <View className="w-full h-64 md:h-96 bg-[#15171B]" />
        <View className="p-4 gap-2">
          <View className="w-24 h-3 bg-[#15171B] rounded" />
          <View className="w-11/12 h-6 bg-[#15171B] rounded" />
          <View className="w-8/12 h-6 bg-[#15171B] rounded" />
          <View className="w-20 h-3 bg-[#15171B] rounded mt-2" />
        </View>
      </Animated.View>
    );
  }

  return (
    <Animated.View className="flex-1 m-2" style={animStyle}>
      <View className="w-full aspect-video bg-[#15171B] mb-2" />
      <View className="w-16 h-2.5 bg-[#15171B] rounded mb-1.5" />
      <View className="w-11/12 h-3.5 bg-[#15171B] rounded mb-1" />
      <View className="w-7/12 h-3.5 bg-[#15171B] rounded mb-2" />
      <View className="w-full h-2.5 bg-[#15171B] rounded" />
    </Animated.View>
  );
}

function NewsCard({
  item,
  onPress,
  onBookmark,
  isSaved,
  isFeatured = false,
}: {
  item: NewsroomArticle;
  onPress: () => void;
  onBookmark: () => void;
  isSaved: boolean;
  isFeatured?: boolean;
}) {
  const formattedDate = "ABOUT 12 HOURS AGO";

  if (isFeatured) {
    return (
      <Pressable onPress={onPress} className="mb-6">
        <View className="relative">
          <Image
            source={{ uri: item.image || FALLBACK_IMAGE }}
            className="w-full h-64 md:h-96 bg-[#15171B]"
            resizeMode="cover"
          />
          <View className="absolute top-4 left-4 flex-row gap-2">
            <View className="bg-[#EE343B] px-2 py-0.5 rounded-sm">
              <Text className="text-white text-[10px] font-bold tracking-widest">
                FEATURED
              </Text>
            </View>
            <View className="bg-[#27292D] px-2 py-0.5 rounded-sm">
              <Text className="text-[#9498A2] text-[10px] font-bold tracking-widest uppercase">
                {item.source}
              </Text>
            </View>
          </View>
          <Pressable
            onPress={onBookmark}
            className="absolute top-4 right-4 bg-[#0C0D0F]/80 p-2 rounded-sm"
          >
            <MaterialCommunityIcons
              name={isSaved ? "bookmark" : "bookmark-outline"}
              size={18}
              color={isSaved ? "#EE343B" : "#F0F2F5"}
            />
          </Pressable>
          <View className="absolute bottom-0 left-0 right-0 p-4 bg-black/40">
            <Text
              className="text-[#F0F2F5] text-xl font-bold mb-1"
              numberOfLines={2}
            >
              {item.title}
            </Text>
            <Text className="text-[#9498A2] text-xs mb-2" numberOfLines={1}>
              {item.description}
            </Text>
            <View className="flex-row items-center gap-1">
              <MaterialCommunityIcons
                name="clock-outline"
                size={12}
                color="#9498A2"
              />
              <Text className="text-[#9498A2] text-[10px] font-bold uppercase tracking-widest">
                {formattedDate}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPress} className="flex-1 m-2">
      <View className="relative aspect-video mb-2">
        <Image
          source={{ uri: item.image || FALLBACK_IMAGE }}
          className="w-full h-full bg-[#15171B]"
          resizeMode="cover"
        />
        <Pressable
          onPress={onBookmark}
          className="absolute top-2 right-2 bg-[#0C0D0F]/80 p-1.5 rounded-sm"
        >
          <MaterialCommunityIcons
            name={isSaved ? "bookmark" : "bookmark-outline"}
            size={14}
            color={isSaved ? "#EE343B" : "#F0F2F5"}
          />
        </Pressable>
      </View>
      <View className="flex-row items-center gap-2 mb-1 flex-wrap">
        <Text className="text-[#EE343B] text-[9px] font-bold tracking-widest uppercase">
          {item.source}
        </Text>
        <Text className="text-[#9498A2] text-[9px] font-bold uppercase">
          • ABOUT 3 HOURS AGO
        </Text>
      </View>
      <Text
        className="text-[#F0F2F5] text-sm font-bold mb-1 leading-tight"
        numberOfLines={3}
      >
        {item.title}
      </Text>
      <Text
        className="text-[#9498A2] text-[11px] leading-snug"
        numberOfLines={2}
      >
        {item.description}
      </Text>
    </Pressable>
  );
}

export default function FeedsScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState<Category[]>([
    // { id: "top", label: "Top Stories", color: "#EE343B" },
  ]);
  const [articles, setArticles] = useState<NewsroomArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const listKey = useRef(0);

  const loadSavedData = () => {
    loadSavedArticles().then((saved) => {
      setSavedIds(new Set(saved.map((a) => a.id)));
    });
  
    loadSavedInterests().then((saved) => {
      if (saved && saved.length > 0) {
        const mapped = saved.map((id) => {
          const interest = EXPLORE_INTERESTS.interests?.find(
            (i) => i.category === id,
          );
          return {
            id: id === "Top Stories" ? "top" : id,
            label: interest?.label || id.charAt(0).toUpperCase() + id.slice(1),
          };
        });
        setCategories([
          // { id: "top", label: "Top Stories", color: "#EE343B" },
          ...mapped,
        ]);
      } else {
        setCategories([
          // { id: "top", label: "Top Stories", color: "#EE343B" },
          // { id: "business", label: "Business" },
          // { id: "technology", label: "Technology" },
          // { id: "world", label: "World" },
          // { id: "sports", label: "Sports" },
        ]);
      }
    });

    if (!selectedCategory) {
      setSelectedCategory("top");
    }
  }

  useEffect(() => {
    loadSavedData();

    const subscription = DeviceEventEmitter.addListener(
      "interestsChanged",
      () => {
        console.log("Interests changed, reloading data...");
        loadSavedData();
      },
    );

    return () => subscription.remove();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadArticles = useCallback(
    async (category: string, isRefresh = false) => {
      if (!isRefresh) setLoading(true);
      setError(null);
      try {
        const section = CATEGORY_TO_GUARDIAN_SECTION[category] ?? category;
        const data = await fetchBySection(section === "top" ? "" : section);
        setArticles(data);
        listKey.current += 1;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unable to load articles.",
        );
        setArticles([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [],
  );

  useEffect(() => {
    loadArticles(selectedCategory);
  }, [selectedCategory, loadArticles]);

  const handleCategorySelect = (catId: string) => {
    if (catId === selectedCategory) return;
    setSelectedCategory(catId);
    setArticles([]);
  };

  const handleArticlePress = (article: NewsroomArticle) => {
    router.push({
      pathname: "/(tabs)/article/[id]",
      params: { id: article.id, articleData: JSON.stringify(article) },
    });
  };

  const handleBookmark = async (article: NewsroomArticle) => {
    const nowSaved = await toggleSaveArticle(article);
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (nowSaved) next.add(article.id);
      else next.delete(article.id);
      return next;
    });
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadArticles(selectedCategory, true);
  };

  const renderHeader = () => (
    <View className="bg-[#0C0D0F]">
      <View className="px-4 py-3.5 flex-row items-center justify-between md:hidden">
        <View className="flex-row items-center gap-2">
          <View className="bg-[#EE343B] rounded px-2 py-1">
            <Text className="text-[#F0F2F5] font-bold text-lg">N</Text>
          </View>
          <View>
            <Text className="text-[#F0F2F5] font-bold text-lg leading-tight">
              NEWSROOM
            </Text>
            <Text className="text-[#9498A2] text-[10px] tracking-widest leading-tight">
              LIVE WIRE
            </Text>
          </View>
        </View>
        <View className="flex-row gap-2">
          <Pressable className="p-2">
            <MaterialCommunityIcons
              name="bell-outline"
              size={22}
              color="#F0F2F5"
            />
          </Pressable>
          <Pressable className="p-2">
            <MaterialCommunityIcons name="logout" size={22} color="#F0F2F5" />
          </Pressable>
        </View>
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={categories}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => handleCategorySelect(item.id)}
            className={`py-3 mr-6 border-b-2 ${selectedCategory === item.id ? "border-[#EE343B]" : "border-transparent"}`}
          >
            <Text
              className={`text-[11px] font-bold tracking-widest ${selectedCategory === item.id ? "text-[#EE343B]" : "text-[#9498A2]"}`}
            >
              {item.label.toUpperCase()}
            </Text>
          </Pressable>
        )}
        className="border-b border-[#27292D]"
      />
    </View>
  );

  const featuredArticle = articles.length > 0 ? articles[0] : null;
  const otherArticles = articles.slice(1);

  return (
    <SafeAreaView className="flex-1 bg-[#0C0D0F]">
      {renderHeader()}

      <FlatList<number | NewsroomArticle>
        data={loading && !refreshing ? [1, 2, 3, 4, 5] : otherArticles}
        keyExtractor={(item, index) =>
          typeof item === "number" ? `skeleton-${index}` : item.id
        }
        numColumns={2}
        columnWrapperStyle={{ paddingHorizontal: 8 }}
        ListHeaderComponent={
          <View>
            <View className="px-4 py-6">
              <Text className="text-[#EE343B] text-[10px] font-bold tracking-widest uppercase mb-1">
                SECTION
              </Text>
              <Text className="text-white text-3xl font-serif font-bold">
                {categories.find((c) => c.id === selectedCategory)?.label ?? ""}
              </Text>
            </View>

            {loading && !refreshing ? (
              <SkeletonCard featured />
            ) : (
              featuredArticle && (
                <NewsCard
                  item={featuredArticle}
                  isFeatured
                  onPress={() => handleArticlePress(featuredArticle)}
                  onBookmark={() => handleBookmark(featuredArticle)}
                  isSaved={savedIds.has(featuredArticle.id)}
                />
              )
            )}
          </View>
        }
        renderItem={({ item }) => {
          if (typeof item === "number") {
            return <SkeletonCard />;
          }
          return (
            <NewsCard
              item={item}
              onPress={() => handleArticlePress(item)}
              onBookmark={() => handleBookmark(item)}
              isSaved={savedIds.has(item.id)}
            />
          );
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#EE343B"
            colors={["#EE343B"]}
          />
        }
        ListFooterComponent={!loading ? <Footer /> : null}
      />
    </SafeAreaView>
  );
}
