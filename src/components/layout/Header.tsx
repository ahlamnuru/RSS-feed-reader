function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-page">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-5 px-4 sm:px-6">
        <a
          href="#main-content"
          className="flex shrink-0 items-center gap-2 font-semibold text-ink no-underline"
          aria-label="Frontpage — go to main content"
        >
          <span
            aria-hidden="true"
            className="grid size-8 place-items-center rounded-lg bg-accent text-sm font-bold text-white"
          >
            F
          </span>
          <span>Frontpage</span>
        </a>

        <nav aria-label="Main navigation" className="hidden sm:block">
          <span
            aria-current="page"
            className="rounded-md bg-panel px-3 py-2 text-sm font-medium text-ink"
          >
            Feed
          </span>
        </nav>

        <div className="ml-auto">
          <a
            href="#add-feed"
            className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border px-3 text-sm font-medium text-ink no-underline hover:bg-panel focus-visible:outline-offset-2"
          >
            <span aria-hidden="true" className="text-lg leading-none">
              +
            </span>
            <span className="hidden sm:inline">Add feed</span>
            <span className="sm:hidden">Add</span>
          </a>
        </div>
      </div>
    </header>
  );
}

export default Header;