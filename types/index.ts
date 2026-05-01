export type TabName = "feeds" | "events" | "search" | "saved" | "explore";
export interface TabItem {
  name: TabName;
  label: string;
  icon: string;
  activeIcon: string;
}
export interface Category {
  id: string;
  label: string;
  color?: string;
}
export interface Event {
  id: number;
  title: string;
  description: string;
  city: string;
  country: string;
  categories: string[];
}
export interface FilterOption {
  label: string;
  value: string;
}
export interface InterestItem {
  label: string;
  category: string;
}
export interface Interest {
  id: string;
  label: string;
  category?: string;
}
export interface InterestGroup {
  categories?: string[];
  interests?: InterestItem[];
  CATEGORIES?: string[];
  INTERESTS?: InterestItem[];
}
export interface CountryOption {
  label: string;
  value: string;
}
export interface GuardianArticleFields {
  thumbnail?: string;
  trailText?: string;
  byline?: string;
  bodyText?: string;
}
export interface GuardianArticle {
  id: string;
  type: string;
  sectionId: string;
  sectionName: string;
  webPublicationDate: string;
  webTitle: string;
  webUrl: string;
  apiUrl: string;
  fields?: GuardianArticleFields;
  pillarName?: string;
}
export interface GuardianResponse {
  response: {
    status: string;
    userTier?: string;
    total: number;
    startIndex?: number;
    pageSize: number;
    currentPage: number;
    pages: number;
    orderBy?: string;
    results: GuardianArticle[];
    content?: GuardianArticle;
  };
}
export interface NewsroomArticle {
  id: string;
  title: string;
  description: string;
  image?: string;
  source: string;
  author?: string;
  publishedAt: string;
  url: string;
  sectionId: string;
  sectionName: string;
  body?: string;
}
export interface SavedArticle extends NewsroomArticle {
  savedAt: number;
}
