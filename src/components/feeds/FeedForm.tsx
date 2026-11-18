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
      if (requestError instanceof Error) {
        setError(requestError.message);
      } else {
        setError("Unable to add this feed");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <label
        htmlFor="feed-url"
        className="block text-sm font-medium text-slate-300"
      >
        RSS feed URL
      </label>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id="feed-url"
          type="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="https://example.com/feed.xml"
          className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-orange-400"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="rounded-lg bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Adding…" : "Add feed"}
        </button>
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      )}
    </form>
  );
}

export default FeedForm;