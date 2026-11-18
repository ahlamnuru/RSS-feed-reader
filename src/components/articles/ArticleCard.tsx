import type { Article } from "../../types/feed";
import { useReaderStore } from "../../store/useReaderStore";

type ArticleCardProps = {
  article: Article;
};

function ArticleCard({ article }: ArticleCardProps) {
  const savedArticleLinks = useReaderStore(
    (state) => state.savedArticleLinks,
  );
  const readArticleLinks = useReaderStore(
    (state) => state.readArticleLinks,
  );
  const toggleSavedArticle = useReaderStore(
    (state) => state.toggleSavedArticle,
  );
  const toggleReadArticle = useReaderStore(
    (state) => state.toggleReadArticle,
  );

  const isSaved = savedArticleLinks.includes(article.link);
  const isRead = readArticleLinks.includes(article.link);

  const publishedDate = article.pubDate
    ? new Date(article.pubDate).toLocaleString()
    : "Unknown date";

  return (
    <article
      className={`rounded-xl border p-5 ${
        isRead
          ? "border-slate-800 bg-slate-900/50"
          : "border-slate-700 bg-slate-900"
      }`}
    >
      <a
        href={article.link}
        target="_blank"
        rel="noreferrer"
        onClick={() => {
          if (!isRead) {
            toggleReadArticle(article.link);
          }
        }}
        className="block text-lg font-semibold text-white hover:text-orange-400"
      >
        {article.title || "Untitled article"}
      </a>

      <p className="mt-2 text-sm text-slate-400">{publishedDate}</p>

      {article.description && (
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-300">
          {article.description}
        </p>
      )}

      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={() => toggleSavedArticle(article.link)}
          className={`rounded-md px-3 py-2 text-sm ${
            isSaved
              ? "bg-orange-500 text-white"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          {isSaved ? "Saved" : "Save"}
        </button>

        <button
          type="button"
          onClick={() => toggleReadArticle(article.link)}
          className="rounded-md bg-slate-800 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700"
        >
          {isRead ? "Mark unread" : "Mark read"}
        </button>
      </div>
    </article>
  );
}

export default ArticleCard;