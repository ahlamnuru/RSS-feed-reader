import { useReaderStore } from "../../store/useReaderStore";

function FeedList() {
  const feeds = useReaderStore((state) => state.feeds);
  const selectedFeedUrl = useReaderStore(
    (state) => state.selectedFeedUrl,
  );
  const selectFeed = useReaderStore((state) => state.selectFeed);
  const removeFeed = useReaderStore((state) => state.removeFeed);

  if (feeds.length === 0) {
    return (
      <section className="rounded-xl border border-slate-800 p-5">
        <p className="text-sm text-slate-400">
          No feeds yet. Add an RSS URL to get started.
        </p>
      </section>
    );
  }

  return (
    <aside className="rounded-xl border border-slate-800 bg-slate-900 p-3">
      <h2 className="mb-3 px-2 text-sm font-semibold text-slate-400">
        Your feeds
      </h2>

      <ul className="space-y-2">
        {feeds.map((feed) => {
          const isSelected = feed.url === selectedFeedUrl;

          return (
            <li key={feed.url}>
              <div
                className={`flex items-center rounded-lg ${
                  isSelected
                    ? "bg-orange-500/15 ring-1 ring-orange-500"
                    : "hover:bg-slate-800"
                }`}
              >
                <button
                  type="button"
                  onClick={() => selectFeed(feed.url)}
                  className="min-w-0 flex-1 px-3 py-3 text-left"
                  aria-current={isSelected ? "page" : undefined}
                >
                  <span className="block truncate font-medium text-white">
                    {feed.title || "Untitled feed"}
                  </span>
                  <span className="block truncate text-xs text-slate-500">
                    {feed.url}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => removeFeed(feed.url)}
                  className="mr-2 rounded-md px-2 py-1 text-sm text-slate-400 hover:bg-slate-700 hover:text-red-400"
                  aria-label={`Remove ${feed.title}`}
                >
                  ×
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

export default FeedList;