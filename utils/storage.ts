import AsyncStorage from "@react-native-async-storage/async-storage";
import { SAVED_INTERESTS_KEY } from "./constants";
import { CACHE_KEYS } from "./api";
import { NewsroomArticle, SavedArticle } from "../types";
export const loadSavedInterests = async (): Promise<string[]> => {
  const raw = await AsyncStorage.getItem(SAVED_INTERESTS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
};
export const saveInterests = async (interests: string[]) => {
  await AsyncStorage.setItem(SAVED_INTERESTS_KEY, JSON.stringify(interests));
};
export const clearSavedInterests = async () => {
  await AsyncStorage.removeItem(SAVED_INTERESTS_KEY);
};
const readSavedMap = async (): Promise<Record<string, SavedArticle>> => {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEYS.saved);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, SavedArticle>;
  } catch {
    return {};
  }
};
const writeSavedMap = async (
  map: Record<string, SavedArticle>,
): Promise<void> => {
  await AsyncStorage.setItem(CACHE_KEYS.saved, JSON.stringify(map));
};
export const loadSavedArticles = async (): Promise<SavedArticle[]> => {
  const map = await readSavedMap();
  return Object.values(map).sort((a, b) => b.savedAt - a.savedAt);
};
export const saveArticle = async (article: NewsroomArticle): Promise<void> => {
  const map = await readSavedMap();
  if (!map[article.id]) {
    map[article.id] = { ...article, savedAt: Date.now() };
    await writeSavedMap(map);
  }
};
export const unsaveArticle = async (articleId: string): Promise<void> => {
  const map = await readSavedMap();
  if (map[articleId]) {
    delete map[articleId];
    await writeSavedMap(map);
  }
};
export const isArticleSaved = async (articleId: string): Promise<boolean> => {
  const map = await readSavedMap();
  return Boolean(map[articleId]);
};
export const toggleSaveArticle = async (
  article: NewsroomArticle,
): Promise<boolean> => {
  const map = await readSavedMap();
  if (map[article.id]) {
    delete map[article.id];
    await writeSavedMap(map);
    return false;
  } else {
    map[article.id] = { ...article, savedAt: Date.now() };
    await writeSavedMap(map);
    return true;
  }
};
