import { useReaderStore } from "../../store/useReaderStore";

function FeedList() {
  const feeds = useReaderStore((state) => state.feeds);
  const selectedFeedUrl = useReaderStore(
    (state) => state.selectedFeedUrl,
  );
  const selectFeed = useReaderStore((state) => state.selectFeed);
  const removeFeed = useReaderStore((state) => state.removeFeed);

  return (
    <section
      aria-label="Your feeds"
      className="rounded-xl border border-border bg-panel p-4"
    >
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-faint">
        Your feeds
      </h2>

      {feeds.length === 0 ? (
        <p className="text-sm leading-6 text-muted">
          Your feeds will appear here after you add one.
        </p>
      ) : (
        <ul className="space-y-1">
          {feeds.map((feed) => {
            const isSelected = feed.url === selectedFeedUrl;

            return (
              <li key={feed.url}>
                <div
                  className={`flex min-h-11 items-center rounded-lg ${
                    isSelected
                      ? "bg-accent-soft text-accent"
                      : "text-muted hover:bg-panel-hover"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => selectFeed(feed.url)}
                    aria-current={isSelected ? "true" : undefined}
                    className="min-w-0 flex-1 px-3 py-2 text-left text-sm font-medium"
                  >
                    <span className="block truncate">
                      {feed.title || "Untitled feed"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => removeFeed(feed.url)}
                    aria-label={`Remove ${feed.title || "untitled feed"}`}
                    className="mr-1 grid size-9 shrink-0 place-items-center rounded-md text-lg text-faint hover:bg-panel-hover hover:text-danger"
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default FeedList;