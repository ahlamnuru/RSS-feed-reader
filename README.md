# Frontpage

A small RSS reader I built for the [Frontend Mentor RSS feed reader challenge](https://www.frontendmentor.io/challenges/rss-feed-reader). Paste a feed link, read the latest articles, save the ones you like and mark what you've already read.

**Live site:** https://rss-feed-reader-pi.vercel.app/

## What it does

- Add RSS 2.0 and Atom feeds by URL
- Shows the articles from the feed you select
- Search articles by title or description
- Filter by All, Unread or Saved
- Save articles and mark them read or unread
- Remove feeds you no longer want
- Remembers your feeds, saved articles and read state in the browser, so there is no account and nothing to sign up for

## What it doesn't do yet

I haven't finished the whole challenge. These are still on my list:

- A combined timeline from all feeds (right now you see one feed at a time)
- Categories for organizing feeds
- OPML import and export
- Guest mode using the sample feeds from the challenge
- An in-app reader view
- A landing page
- Accounts

## Built with

- React 19 and TypeScript
- Vite
- Tailwind CSS 4
- Zustand for the app state (feeds, saved and read articles)
- TanStack Query for fetching and caching articles

## How it works

Browsers won't let a web page download a feed straight from another website (that's CORS). So the app asks its own endpoint, `/api/feed?url=...`, to download the feed and send the XML back.

- When running locally, that endpoint is a small plugin in `vite.config.ts`.
- On Vercel, it's a serverless function in `api/feed.ts`.

Once the XML arrives, `DOMParser` reads it. RSS `<item>` tags and Atom `<entry>` tags both get turned into the same article shape, and HTML is stripped out of the descriptions.

Only the feed list, saved links and read links are stored (in localStorage). The articles themselves are fetched again when needed and cached for five minutes.

## Run it locally

You need Node 20 or newer and [pnpm](https://pnpm.io/).

```bash
git clone https://github.com/ahlamnuru/RSS-feed-reader.git
cd RSS-feed-reader
pnpm install
pnpm dev
```

Then open http://localhost:5173.

## Project structure

```
api/feed.ts                  feed proxy for Vercel
src/
  components/
    articles/                article list, cards, filters
    feeds/                   add-feed form and feed list
    layout/                  header
  features/feeds/
    feedApi.ts               fetches and parses RSS and Atom
    useFeedQuery.ts          TanStack Query hook
  store/useReaderStore.ts    Zustand store
  types/feed.ts              Article and Feed types
vite.config.ts               includes the local feed proxy
```

