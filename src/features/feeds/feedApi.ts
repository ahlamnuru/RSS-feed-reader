import type { Article, Feed, FeedResult } from "../../types/feed";

type XmlNode = Element | Document;

function getText(parent: XmlNode, selector: string): string {
  return parent.querySelector(selector)?.textContent?.trim() ?? "";
}

function stripHtml(html: string): string {
  if (!html) return "";
  const doc = new DOMParser().parseFromString(html, "text/html");
  return (doc.body.textContent ?? "").replace(/\s+/g, " ").trim();
}

function getAtomLink(entry: Element): string {
  const links = Array.from(entry.querySelectorAll("link"));
  const preferred =
    links.find((l) => !l.getAttribute("rel") || l.getAttribute("rel") === "alternate") ??
    links[0];
  return preferred?.getAttribute("href")?.trim() ?? "";
}

function parseRss(document: Document, url: string): FeedResult {
  const articles: Article[] = Array.from(document.querySelectorAll("item")).map(
    (item) => ({
      title: getText(item, "title"),
      link: getText(item, "link"),
      description: stripHtml(getText(item, "description")),
      pubDate: getText(item, "pubDate"),
      feedUrl: url,
    }),
  );

  return {
    feed: {
      title: getText(document, "channel > title"),
      url,
      description: stripHtml(getText(document, "channel > description")),
    },
    articles,
  };
}

function parseAtom(document: Document, url: string): FeedResult {
  const articles: Article[] = Array.from(document.querySelectorAll("entry")).map(
    (entry) => ({
      title: getText(entry, "title"),
      link: getAtomLink(entry),
      description: stripHtml(
        getText(entry, "summary") || getText(entry, "content"),
      ),
      pubDate: getText(entry, "published") || getText(entry, "updated"),
      feedUrl: url,
    }),
  );

  return {
    feed: {
      title: getText(document, "feed > title"),
      url,
      description: stripHtml(getText(document, "feed > subtitle")),
    },
    articles,
  };
}

function getFeedData(document: Document, url: string): FeedResult {
  const isAtom = document.documentElement.tagName.toLowerCase() === "feed";
  return isAtom ? parseAtom(document, url) : parseRss(document, url);
}

async function fetchDocument(url: string): Promise<Document> {
  let response: Response;

  try {
    response = await fetch(`/api/feed?url=${encodeURIComponent(url)}`, {
      signal: AbortSignal.timeout(12000),
    });
  } catch {
    throw new Error("Unable to reach this feed. Try again in a moment");
  }

  if (!response.ok) {
    throw new Error(`Unable to load this feed (${response.status})`);
  }

  const xml = await response.text();

  if (!xml.trim()) {
    throw new Error("The feed returned empty data");
  }

  const document = new DOMParser().parseFromString(xml, "application/xml");

  if (document.querySelector("parsererror")) {
    throw new Error("This URL does not contain a valid RSS or Atom feed");
  }

  return document;
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

  const document = await fetchDocument(parsedUrl.toString());

  return getFeedData(document, parsedUrl.toString());
}

export async function fetchAllFeeds(feeds: Feed[]): Promise<FeedResult[]> {
  const results = await Promise.allSettled(feeds.map((f) => fetchFeed(f.url)));
  return results
    .filter((r): r is PromiseFulfilledResult<FeedResult> => r.status === "fulfilled")
    .map((r) => r.value);
}