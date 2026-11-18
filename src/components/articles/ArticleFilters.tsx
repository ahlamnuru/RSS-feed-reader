import { useReaderStore } from "../../store/useReaderStore";

const filters = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "saved", label: "Saved" },
] as const;

function ArticleFilters() {
  const activeFilter = useReaderStore((state) => state.activeFilter);
  const setActiveFilter = useReaderStore(
    (state) => state.setActiveFilter,
  );

  return (
    <div className="flex flex-wrap gap-2" aria-label="Article filters">
      {filters.map((filter) => {
        const isActive = activeFilter === filter.value;

        return (
          <button
            key={filter.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => setActiveFilter(filter.value)}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              isActive
                ? "bg-orange-500 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
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