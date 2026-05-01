import AsyncStorage from "@react-native-async-storage/async-storage";
import { GuardianArticle, GuardianResponse, NewsroomArticle } from "../types";
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}
const DEFAULT_TTL_MS = 15 * 60 * 1000;
export const getCached = async <T>(
  key: string,
  maxAgeMs: number = DEFAULT_TTL_MS,
): Promise<T | null> => {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;
    const entry = JSON.parse(raw) as CacheEntry<T>;
    if (Date.now() - entry.timestamp > maxAgeMs) return null;
    return entry.data;
  } catch {
    return null;
  }
};
export const setCache = async <T>(key: string, data: T): Promise<void> => {
  try {
    const entry: CacheEntry<T> = { data, timestamp: Date.now() };
    await AsyncStorage.setItem(key, JSON.stringify(entry));
  } catch {}
};
export const clearCacheByPrefix = async (prefix: string): Promise<void> => {
  try {
    const allKeys = await AsyncStorage.getAllKeys();
    const matching = allKeys.filter((k) => k.startsWith(prefix));
    if (matching.length > 0) await AsyncStorage.multiRemove(matching);
  } catch {}
};
export const CACHE_KEYS = {
  feeds: (section: string) => `guardian:feeds:${section}`,
  search: (query: string) => `guardian:search:${query.toLowerCase().trim()}`,
  article: (id: string) => `guardian:article:${id}`,
  saved: "newsroom:saved_articles",
} as const;
export const TTL = {
  feeds: 15 * 60 * 1000,
  search: 30 * 60 * 1000,
  article: 60 * 60 * 1000,
} as const;
const BASE_URL = process.env.EXPO_PUBLIC_The_Guardian_API_BASE_URL || "";
const API_KEY = process.env.EXPO_PUBLIC_GUARDIAN_API_KEY || "";
const SHOW_FIELDS = "thumbnail,trailText,byline";
const SHOW_FIELDS_FULL = "thumbnail,trailText,byline,bodyText";
function buildUrl(
  path: string,
  params: Record<string, string | number>,
): string {
  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.set("api-key", API_KEY);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value));
  }
  return url.toString();
}
export function mapGuardianArticle(raw: GuardianArticle): NewsroomArticle {
  return {
    id: raw.id,
    title: raw.webTitle,
    description: raw.fields?.trailText
      ? raw.fields.trailText.replace(/<[^>]+>/g, "")
      : "",
    image: raw.fields?.thumbnail ?? undefined,
    source: "The Guardian",
    author: raw.fields?.byline ?? undefined,
    publishedAt: raw.webPublicationDate,
    url: raw.webUrl,
    sectionId: raw.sectionId,
    sectionName: raw.sectionName,
    body: raw.fields?.bodyText
      ? raw.fields.bodyText.replace(/<[^>]+>/g, "")
      : undefined,
  };
}
async function guardianFetch(url: string): Promise<GuardianArticle[]> {
  let response: Response;
  try {
    response = await fetch(url);
  } catch {
    throw new Error("No internet connection. Please check your network.");
  }
  if (response.status === 401) {
    return [];
  }
  if (!response.ok) {
    throw new Error(
      `Guardian API error: ${response.status} ${response.statusText}`,
    );
  }
  const json = (await response.json()) as GuardianResponse;
  if (json.response.status !== "ok") {
    throw new Error("Guardian API returned an unexpected response.");
  }
  return json.response.results;
}
export const fetchTopStories = async (page = 1): Promise<NewsroomArticle[]> => {
  const cacheKey = CACHE_KEYS.feeds("top");
  if (page === 1) {
    const cached = await getCached<NewsroomArticle[]>(cacheKey, TTL.feeds);
    if (cached) return cached;
  }
  const url = buildUrl("/search", {
    "order-by": "newest",
    "show-fields": SHOW_FIELDS,
    "page-size": 20,
    page,
  });
  const raw = await guardianFetch(url);
  const articles = raw.map(mapGuardianArticle);
  if (page === 1) await setCache(cacheKey, articles);
  return articles;
};
export const fetchBySection = async (
  sectionId: string,
  page = 1,
): Promise<NewsroomArticle[]> => {
  if (!sectionId || sectionId === "top") return fetchTopStories(page);
  const cacheKey = CACHE_KEYS.feeds(sectionId);
  if (page === 1) {
    const cached = await getCached<NewsroomArticle[]>(cacheKey, TTL.feeds);
    if (cached) return cached;
  }
  const url = buildUrl("/search", {
    section: sectionId,
    "order-by": "newest",
    "show-fields": SHOW_FIELDS,
    "page-size": 20,
    page,
  });
  const raw = await guardianFetch(url);
  const articles = raw.map(mapGuardianArticle);
  if (page === 1) await setCache(cacheKey, articles);
  return articles;
};
export const searchGuardianArticles = async (
  query: string,
  page = 1,
): Promise<NewsroomArticle[]> => {
  const trimmed = query.trim();
  if (!trimmed) return fetchTopStories(page);
  const cacheKey = CACHE_KEYS.search(trimmed);
  if (page === 1) {
    const cached = await getCached<NewsroomArticle[]>(cacheKey, TTL.search);
    if (cached) return cached;
  }
  const url = buildUrl("/search", {
    q: trimmed,
    "order-by": "newest",
    "show-fields": SHOW_FIELDS,
    "page-size": 20,
    page,
  });
  const raw = await guardianFetch(url);
  const articles = raw.map(mapGuardianArticle);
  if (page === 1) await setCache(cacheKey, articles);
  return articles;
};
export const fetchArticleById = async (
  id: string,
): Promise<NewsroomArticle | null> => {
  const cacheKey = CACHE_KEYS.article(id);
  const cached = await getCached<NewsroomArticle>(cacheKey, TTL.article);
  if (cached) return cached;
  const url = buildUrl(`/${id}`, { "show-fields": SHOW_FIELDS_FULL });
  let response: Response;
  try {
    response = await fetch(url);
  } catch {
    return null;
  }
  if (!response.ok) return null;
  const json = (await response.json()) as {
    response: { status: string; content: GuardianArticle };
  };
  if (json.response.status !== "ok" || !json.response.content) return null;
  const article = mapGuardianArticle(json.response.content);
  await setCache(cacheKey, article);
  return article;
};
