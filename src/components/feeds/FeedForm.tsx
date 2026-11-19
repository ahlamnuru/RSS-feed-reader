import { useState, type FormEvent } from "react";
import { fetchFeed } from "../../features/feeds/feedApi";
import { useReaderStore } from "../../store/useReaderStore";

function FeedForm() {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const addFeed = useReaderStore((state) => state.addFeed);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!url.trim()) {
      setError("Enter an RSS feed URL");
      return;
    }

    setIsLoading(true);

    try {
      const result = await fetchFeed(url.trim());
      addFeed(result.feed);
      setUrl("");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to add this feed",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form id="add-feed" onSubmit={handleSubmit} className="space-y-3">
      <label htmlFor="feed-url" className="block text-sm font-medium text-ink">
        RSS feed URL
      </label>

      <div className="flex flex-col gap-2">
        <input
          id="feed-url"
          type="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="https://example.com/feed.xml"
          aria-describedby={error ? "feed-url-error" : undefined}
          aria-invalid={error ? true : undefined}
          className="min-h-11 min-w-0 rounded-lg border border-border bg-page px-3 text-sm text-ink placeholder:text-faint"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="min-h-11 rounded-lg bg-accent px-4 text-sm font-semibold text-white hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Adding…" : "Add feed"}
        </button>
      </div>

      {error && (
        <p id="feed-url-error" role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
    </form>
  );
}

export default FeedForm;