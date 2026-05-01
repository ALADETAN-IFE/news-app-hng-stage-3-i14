import {
  View,
  Text,
  Pressable,
  Image,
  FlatList,
  useWindowDimensions,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useMemo, useState, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { SavedArticle } from "../../types";
import { loadSavedArticles, unsaveArticle } from "../../utils/storage";
import { useFocusEffect } from "@react-navigation/native";
import Footer from "../../components/Footer";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&q=80&w=800";

export default function SavedScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [search, setSearch] = useState("");
  const [articles, setArticles] = useState<SavedArticle[]>([]);
  const [loading, setLoading] = useState(true);

  const numColumns = useMemo(() => {
    if (width > 1024) return 3;
    if (width > 768) return 2;
    return 1;
  }, [width]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      loadSavedArticles().then((data) => {
        if (active) {
          setArticles(data);
          setLoading(false);
        }
      });
      return () => {
        active = false;
      };
    }, []),
  );

  const filteredArticles = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return articles;
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.sectionName.toLowerCase().includes(q),
    );
  }, [search, articles]);

  const handleRemove = async (article: SavedArticle) => {
    await unsaveArticle(article.id);
    setArticles((prev) => prev.filter((a) => a.id !== article.id));
  };

  const handleArticlePress = (article: SavedArticle) => {
    router.push({
      pathname: "/(tabs)/article/[id]",
      params: { id: article.id, articleData: JSON.stringify(article) },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0C0D0F]">
      <View className="bg-[#0C0D0F] border-b border-[#27292D] px-4 py-4 gap-4">
        <View className="flex-row items-center justify-between md:hidden">
          <View className="flex-row items-center gap-2">
            <View className="bg-[#EE343B] rounded px-2 py-1">
              <Text className="text-[#F0F2F5] font-bold text-lg">N</Text>
            </View>
            <Text className="text-[#F0F2F5] font-bold text-[17px] leading-tight">
              NEWSROOM
            </Text>
          </View>
          <Text className="text-[#9498A2] text-[11px] tracking-widest">
            SAVED
          </Text>
        </View>
        <Text className="text-[#F0F2F5] text-[26px] font-bold">
          Saved articles
        </Text>
        <View className="flex-row items-center border border-[#EE343B] bg-[#0B0C0E] px-3 py-3">
          <MaterialCommunityIcons name="magnify" size={18} color="#9498A2" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Filter saved stories…"
            placeholderTextColor="#9498A2"
            className="flex-1 ml-2 text-sm text-[#F0F2F5]"
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch("")} className="p-1">
              <MaterialCommunityIcons name="close" size={18} color="#9498A2" />
            </Pressable>
          )}
        </View>
        <Text className="text-[#9498A2] text-[11px] tracking-widest uppercase">
          {filteredArticles.length} article
          {filteredArticles.length !== 1 ? "s" : ""} saved
        </Text>
      </View>
      {loading ? (
        <View className="flex-1 items-center justify-center gap-3">
          <ActivityIndicator color="#EE343B" size="large" />
          <Text className="text-[#9498A2] text-[13px]">
            Loading saved articles…
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredArticles}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          key={numColumns}
          columnWrapperStyle={
            numColumns > 1
              ? { gap: 12, paddingHorizontal: 16, marginTop: 12 }
              : undefined
          }
          renderItem={({ item, index }) => (
            <Animated.View
              className="flex-1"
              entering={FadeInDown.delay(index * 60)
                .duration(350)
                .springify()}
            >
              <Pressable
                onPress={() => handleArticlePress(item)}
                className="mb-3 flex-1"
              >
                <View className="border border-[#27292D] bg-[#15171B] overflow-hidden">
                  <View className="relative">
                    <Image
                      source={{ uri: item.image || FALLBACK_IMAGE }}
                      className={`w-full bg-[#15171B] ${numColumns === 1 ? "h-44" : "h-36"}`}
                      resizeMode="cover"
                    />
                    <Pressable
                      onPress={() => handleRemove(item)}
                      className="absolute top-2.5 right-2.5 bg-black/85 p-2 rounded"
                    >
                      <MaterialCommunityIcons
                        name="bookmark"
                        size={18}
                        color="#EE343B"
                      />
                    </Pressable>
                  </View>
                  <View className="p-3 gap-1.5">
                    <Text className="text-[#EE343B] text-[10px] font-bold tracking-widest uppercase">
                      {item.sectionName}
                    </Text>
                    <Text
                      className="text-[#F0F2F5] text-sm font-bold leading-snug"
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
            <Animated.View
              entering={FadeIn.duration(400)}
            >
              <View className="items-center py-14 px-8 gap-2">
                <MaterialCommunityIcons
                  name="bookmark-off-outline"
                  size={56}
                  color="#9498A2"
                />
                <Text className="text-[#F0F2F5] text-lg font-bold text-center mt-2">
                  {search.trim() ? "No matching articles" : "Nothing saved yet"}
                </Text>
                <Text className="text-[#9498A2] text-[13px] text-center leading-5">
                  {search.trim()
                    ? "Try a different search term."
                    : "Tap the bookmark icon on any article to save it here."}
                </Text>
              </View>
            </Animated.View>
          }
          contentContainerStyle={{
            paddingTop: 12,
            paddingBottom: 0,
            paddingHorizontal: numColumns === 1 ? 16 : 0,
          }}
          ListFooterComponent={<Footer />}
        />
      )}
    </SafeAreaView>
  );
}
