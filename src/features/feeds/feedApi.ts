import type { Article, Feed, FeedResult } from "../../types/feed";

type XmlNode = Element | Document;

function getText(parent: XmlNode, selector: string): string {
  return parent.querySelector(selector)?.textContent?.trim() ?? "";
}

function getFeedData(document: Document, url: string): FeedResult {
  const articles: Article[] = Array.from(
    document.querySelectorAll("item"),
  ).map((item) => ({
    title: getText(item, "title"),
    link: getText(item, "link"),
    description: getText(item, "description"),
    pubDate: getText(item, "pubDate"),
    feedUrl: url,
  }));

  return {
    feed: {
      title: getText(document, "channel > title"),
      url,
      description: getText(document, "channel > description"),
    },
    articles,
  };
}

export async function fetchFeed(url: string): Promise<FeedResult> {
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(url);
  } catch {
    throw new Error("Enter a complete feed URL beginning with https://");
  }

  if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
    throw new Error("Only HTTP and HTTPS feed URLs are supported");
  }

  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(
    parsedUrl.toString(),
  )}`;

  const response = await fetch(proxyUrl);

  if (!response.ok) {
    throw new Error(`Unable to load this feed (${response.status})`);
  }

  const xml = await response.text();

  if (!xml.trim()) {
    throw new Error("The feed returned empty data");
  }

  const document = new DOMParser().parseFromString(xml, "application/xml");

  const parseError = document.querySelector("parsererror");

  if (parseError) {
    throw new Error("This URL does not contain a valid RSS feed");
  }

  return getFeedData(document, parsedUrl.toString());
}

export function fetchAllFeeds(feeds: Feed[]): Promise<FeedResult[]> {
  return Promise.all(feeds.map((feed) => fetchFeed(feed.url)));
}