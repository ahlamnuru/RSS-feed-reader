import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Feed } from "../types/feed";

type ArticleFilter = "all" | "unread" | "saved";

type ReaderState = {
  feeds: Feed[];
  selectedFeedUrl: string | null;
  savedArticleLinks: string[];
  readArticleLinks: string[];
  activeFilter: ArticleFilter;
  addFeed: (feed: Feed) => void;
  removeFeed: (url: string) => void;
  selectFeed: (url: string) => void;
  toggleSavedArticle: (link: string) => void;
  toggleReadArticle: (link: string) => void;
  setActiveFilter: (filter: ArticleFilter) => void;
};

export const useReaderStore = create<ReaderState>()(
  persist(
    (set) => ({
      feeds: [],
      selectedFeedUrl: null,
      savedArticleLinks: [],
      readArticleLinks: [],
      activeFilter: "all",

      addFeed: (feed) =>
        set((state) => {
          const alreadyExists = state.feeds.some(
            (existingFeed) => existingFeed.url === feed.url,
          );

          if (alreadyExists) {
            return state;
          }

          return {
            feeds: [...state.feeds, feed],
            selectedFeedUrl: state.selectedFeedUrl ?? feed.url,
          };
        }),

      removeFeed: (url) =>
        set((state) => {
          const remainingFeeds = state.feeds.filter(
            (feed) => feed.url !== url,
          );

          return {
            feeds: remainingFeeds,
            selectedFeedUrl:
              state.selectedFeedUrl === url
                ? (remainingFeeds[0]?.url ?? null)
                : state.selectedFeedUrl,
          };
        }),

      selectFeed: (url) => set({ selectedFeedUrl: url }),

      toggleSavedArticle: (link) =>
        set((state) => ({
          savedArticleLinks: state.savedArticleLinks.includes(link)
            ? state.savedArticleLinks.filter(
                (savedLink) => savedLink !== link,
              )
            : [...state.savedArticleLinks, link],
        })),

      toggleReadArticle: (link) =>
        set((state) => ({
          readArticleLinks: state.readArticleLinks.includes(link)
            ? state.readArticleLinks.filter(
                (readLink) => readLink !== link,
              )
            : [...state.readArticleLinks, link],
        })),

      setActiveFilter: (filter) => set({ activeFilter: filter }),
    }),
    {
      name: "rss-reader-store",
    },
  ),
);