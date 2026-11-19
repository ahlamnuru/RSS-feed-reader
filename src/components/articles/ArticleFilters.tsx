import { useReaderStore } from "../../store/useReaderStore";

const filters = [
  { value: "all", label: "All items" },
  { value: "unread", label: "Unread" },
  { value: "saved", label: "Saved" },
] as const;

function ArticleFilters() {
  const activeFilter = useReaderStore((state) => state.activeFilter);
  const setActiveFilter = useReaderStore(
    (state) => state.setActiveFilter,
  );

  return (
    <div
      className="flex flex-wrap gap-2"
      role="group"
      aria-label="Filter articles"
    >
      {filters.map((filter) => {
        const isActive = activeFilter === filter.value;

        return (
          <button
            key={filter.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => setActiveFilter(filter.value)}
            className={`min-h-11 rounded-lg px-3 text-sm font-medium ${
              isActive
                ? "bg-accent-soft text-accent"
                : "text-muted hover:bg-panel-hover"
            }`}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}

export default ArticleFilters;