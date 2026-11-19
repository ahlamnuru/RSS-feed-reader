import type { Article } from "../../types/feed";
import { useReaderStore } from "../../store/useReaderStore";

type ArticleCardProps = {
  article: Article;
};

function formatPublishedDate(dateText: string): string {
  if (!dateText) {
    return "Date unavailable";
  }

  const date = new Date(dateText);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getSourceName(feedUrl: string): string {
  try {
    return new URL(feedUrl).hostname.replace(/^www\./, "");
  } catch {
    return "Unknown source";
  }
}

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
  const sourceName = getSourceName(article.feedUrl);

  return (
    <article
      className={`relative border-b border-border-subtle px-4 py-5 transition-colors hover:bg-panel/70 sm:px-6 ${
        isRead ? "bg-page" : "bg-page"
      }`}
    >
      <div className="flex gap-3">
        <span
          aria-hidden="true"
          className={`mt-2 size-2 shrink-0 rounded-full ${
            isRead ? "bg-transparent" : "bg-accent"
          }`}
        />

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-faint">
            <span className="font-medium text-muted">{sourceName}</span>
            <span aria-hidden="true">·</span>
            <time dateTime={article.pubDate || undefined}>
              {formatPublishedDate(article.pubDate)}
            </time>
            {isRead && <span className="sr-only">Read</span>}
            {!isRead && <span className="font-medium text-accent">Unread</span>}
          </div>

          <h3 className="text-base font-semibold leading-snug text-ink">
            <a
              href={article.link}
              target="_blank"
              rel="noreferrer"
              onClick={() => {
                if (!isRead) {
                  toggleReadArticle(article.link);
                }
              }}
              className="rounded-sm underline decoration-transparent underline-offset-2 hover:decoration-current"
            >
              {article.title || "Untitled article"}
            </a>
          </h3>

          {article.description && (
            <p className="mt-1 line-clamp-3 text-sm leading-6 text-muted">
              {article.description}
            </p>
          )}

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              aria-pressed={isSaved}
              onClick={() => toggleSavedArticle(article.link)}
              className="min-h-11 rounded-md px-3 text-sm font-medium text-muted hover:bg-panel-hover hover:text-ink"
            >
              {isSaved ? "Saved" : "Save"}
              <span className="sr-only">
                {" "}
                {isSaved ? "article" : "article"}
              </span>
            </button>

            <button
              type="button"
              aria-pressed={isRead}
              onClick={() => toggleReadArticle(article.link)}
              className="min-h-11 rounded-md px-3 text-sm font-medium text-muted hover:bg-panel-hover hover:text-ink"
            >
              {isRead ? "Mark unread" : "Mark read"}
              <span className="sr-only">: {article.title}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default ArticleCard;