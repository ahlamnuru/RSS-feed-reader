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
      <section className="rounded-xl border border-slate-800 p-5">
        <p className="text-slate-400">
          Select a feed to view its articles.
        </p>
      </section>
    );
  }

  if (query.isLoading) {
    return (
      <section className="rounded-xl border border-slate-800 p-5">
        <p className="text-slate-400">Loading articles…</p>
      </section>
    );
  }

  if (query.isError) {
    return (
      <section className="rounded-xl border border-red-900 p-5">
        <p className="text-red-400">
          {query.error instanceof Error
            ? query.error.message
            : "Unable to load articles"}
        </p>
      </section>
    );
  }

  const normalizedSearch = searchTerm.toLowerCase().trim();
  const articles = query.data?.articles ?? [];

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
    <section>
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold">
          {query.data?.feed.title ?? "Articles"}
        </h2>

        <button
          type="button"
          onClick={() => query.refetch()}
          disabled={query.isFetching}
          className="rounded-md bg-slate-800 px-3 py-2 text-sm hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {query.isFetching ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      <div className="mb-5 space-y-4">
        <label htmlFor="article-search" className="sr-only">
          Search articles
        </label>

        <input
          id="article-search"
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search articles..."
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-orange-400"
        />

        <ArticleFilters />
      </div>

      {filteredArticles.length === 0 ? (
        <div className="rounded-xl border border-slate-800 p-5">
          <p className="text-slate-400">
            No articles match your search or filter.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredArticles.map((article) => (
            <ArticleCard
              key={article.link || article.title}
              article={article}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default ArticleList;