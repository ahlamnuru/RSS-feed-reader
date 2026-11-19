import { useState } from "react";
import { useFeedQuery } from "../../features/feeds/useFreeQuery";
import { useReaderStore } from "../../store/useReaderStore";
import ArticleCard from "./ArticleCard";
import ArticleFilters from "./ArticleFilters";

function ArticleList() {
  const [searchTerm, setSearchTerm] = useState("");

  const selectedFeedUrl = useReaderStore(
    (state) => state.selectedFeedUrl,
  );
  const activeFilter = useReaderStore((state) => state.activeFilter);
  const savedArticleLinks = useReaderStore(
    (state) => state.savedArticleLinks,
  );
  const readArticleLinks = useReaderStore(
    (state) => state.readArticleLinks,
  );

  const query = useFeedQuery(selectedFeedUrl);

  if (!selectedFeedUrl) {
    return (
      <section
        aria-live="polite"
        className="rounded-xl border border-border bg-page p-6"
      >
        <h2 className="text-lg font-semibold text-ink">All items</h2>
        <p className="mt-2 text-sm text-muted">
          Add or select a feed to see its articles here.
        </p>
      </section>
    );
  }

  if (query.isLoading) {
    return (
      <section aria-live="polite" className="space-y-3">
        <p className="text-sm text-muted">Loading articles…</p>
        <div className="h-28 animate-pulse rounded-xl bg-panel" />
        <div className="h-28 animate-pulse rounded-xl bg-panel" />
      </section>
    );
  }

  if (query.isError) {
    return (
      <section
        role="alert"
        className="rounded-xl border border-border bg-page p-6"
      >
        <h2 className="font-semibold text-ink">We couldn’t load this feed</h2>
        <p className="mt-2 text-sm text-muted">
          Check the feed address or try refreshing in a moment.
        </p>
        <button
          type="button"
          onClick={() => query.refetch()}
          className="mt-4 min-h-11 rounded-lg bg-accent px-4 text-sm font-semibold text-white hover:bg-accent-hover"
        >
          Try again
        </button>
      </section>
    );
  }

  const articles = query.data?.articles ?? [];
  const normalizedSearch = searchTerm.toLowerCase().trim();

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      normalizedSearch === "" ||
      article.title.toLowerCase().includes(normalizedSearch) ||
      article.description.toLowerCase().includes(normalizedSearch);

    const isRead = readArticleLinks.includes(article.link);
    const isSaved = savedArticleLinks.includes(article.link);

    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "unread" && !isRead) ||
      (activeFilter === "saved" && isSaved);

    return matchesSearch && matchesFilter;
  });

  return (
    <section aria-labelledby="article-list-heading">
      <div className="flex flex-col gap-4 border-b border-border bg-page p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h2
            id="article-list-heading"
            className="text-xl font-semibold text-ink"
          >
            {activeFilter === "saved" ? "Saved" : "All items"}
          </h2>
          <p className="mt-1 text-sm text-muted">
            {filteredArticles.length}{" "}
            {filteredArticles.length === 1 ? "article" : "articles"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => query.refetch()}
          disabled={query.isFetching}
          className="min-h-11 rounded-lg border border-border px-4 text-sm font-medium text-ink hover:bg-panel disabled:opacity-60"
        >
          {query.isFetching ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      <div className="space-y-3 border-b border-border bg-page p-4 sm:px-6">
        <label htmlFor="article-search" className="sr-only">
          Search articles
        </label>
        <input
          id="article-search"
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search articles..."
          className="min-h-11 w-full rounded-lg border border-border bg-page px-3 text-sm text-ink placeholder:text-faint sm:max-w-md"
        />
        <ArticleFilters />
      </div>

      <div aria-live="polite" aria-busy={query.isFetching}>
        {filteredArticles.length === 0 ? (
          <div className="p-6 text-sm text-muted">
            {searchTerm
              ? "No articles match that search. Try another word."
              : "No articles match this filter."}
          </div>
        ) : (
          filteredArticles.map((article) => (
            <ArticleCard
              key={article.link || article.title}
              article={article}
            />
          ))
        )}
      </div>
    </section>
  );
}

export default ArticleList;