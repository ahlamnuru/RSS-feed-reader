export type Article = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  feedUrl: string;
};

export type Feed = {
  title: string;
  url: string;
  description: string;
};

export type FeedResult = {
  feed: Feed;
  articles: Article[];
};