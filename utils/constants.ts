import { Category, CountryOption, InterestGroup, TabItem } from "../types";
export const APP_BG = "#0C0D0F";
export const APP_PANEL = "#15171B";
export const APP_PANEL_ALT = "#1B1D22";
export const APP_BORDER = "#27292D";
export const APP_TEXT = "#F0F2F5";
export const APP_TEXT_MUTED = "#9498A2";
export const APP_RED = "#EE343B";
export const GUARDIAN_BASE_URL = "https://content.guardianapis.com";
/**
 * Maps an app category id to its Guardian API section name.
 * An empty string means no section filter (top stories).
 */
export const CATEGORY_TO_GUARDIAN_SECTION: Record<string, string> = {
  "Top Stories": "top",
  Business: "business",
  Technology: "technology",
  World: "world",
  Sports: "sport",
  Science: "science",
  Health: "society",
  Entertainment: "culture",
};
export const SAVED_INTERESTS_KEY = "selectedInterests";
export const TAB_ITEMS: TabItem[] = [
  {
    name: "feeds",
    label: "FEEDS",
    icon: "newspaper-variant-outline",
    activeIcon: "newspaper-variant",
  },
  {
    name: "events",
    label: "EVENTS",
    icon: "calendar-outline",
    activeIcon: "calendar",
  },
  {
    name: "search",
    label: "SEARCH",
    icon: "magnify",
    activeIcon: "magnify",
  },
  {
    name: "saved",
    label: "SAVED",
    icon: "bookmark-outline",
    activeIcon: "bookmark",
  },
];
export const FEED_CATEGORIES: Category[] = [
  { id: "top", label: "Top Stories", color: APP_RED },
  { id: "business", label: "Business" },
  { id: "technology", label: "Technology" },
  { id: "world", label: "World" },
  { id: "sports", label: "Sports" },
];
export const EXPLORE_INTERESTS: InterestGroup = {
  categories: [
    "TOP STORIES",
    "BUSINESS",
    "TECHNOLOGY",
    "WORLD",
    "SPORTS",
    "SCIENCE",
    "HEALTH",
    "ENTERTAINMENT",
  ],
  interests: [
    { label: "AI", category: "ai" },
    { label: "STARTUPS", category: "startups" },
    { label: "CRYPTO", category: "crypto" },
    { label: "CLIMATE", category: "climate" },
    { label: "SPACE", category: "space" },
    { label: "FOOTBALL", category: "football" },
    { label: "Formula 1", category: "formula-1" },
    { label: "Basketball", category: "basketball" },
    { label: "Cycling", category: "cycling" },
    { label: "Hiking", category: "hiking" },
    { label: "Photography", category: "photography" },
    { label: "Gaming", category: "gaming" },
    { label: "Movies", category: "movies" },
    { label: "Music", category: "music" },
    { label: "Cooking", category: "cooking" },
    { label: "Travel", category: "travel" },
    { label: "Fashion", category: "fashion" },
    { label: "Stock Market", category: "stock-market" },
    { label: "Real Estate", category: "real-estate" },
    { label: "Productivity", category: "productivity" },
    { label: "Design", category: "design" },
    { label: "Programming", category: "programming" },
    { label: "Cybersecurity", category: "cybersecurity" },
    { label: "Healthcare", category: "healthcare" },
    { label: "Education", category: "education" },
    { label: "Politics", category: "politics" },
    { label: "Books", category: "books" },
    { label: "EVs", category: "evs" },
  ],
};
export const COUNTRY_OPTIONS: CountryOption[] = [
  { label: "Any country", value: "any" },
  { label: "Nigeria", value: "nigeria" },
  { label: "United States", value: "united-states" },
  { label: "United Kingdom", value: "united-kingdom" },
  { label: "Canada", value: "canada" },
  { label: "Australia", value: "australia" },
];
