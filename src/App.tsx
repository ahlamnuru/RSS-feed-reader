import ArticleList from "./components/articles/ArticleList";
import FeedForm from "./components/feeds/FeedForm";
import FeedList from "./components/feeds/FeedList";
import Header from "./components/layout/Header";

function App() {
  return (
    <div className="min-h-screen bg-page text-ink">
      <Header />

      <main
        id="main-content"
        className="mx-auto grid max-w-[1600px] lg:grid-cols-[260px_minmax(0,1fr)]"
      >
        <aside
          aria-label="Feed management"
          className="border-b border-border bg-panel p-4 lg:min-h-[calc(100vh-4rem)] lg:border-r lg:border-b-0"
        >
          <div className="space-y-4">
            <FeedForm />
            <FeedList />
          </div>
        </aside>

        <div className="min-w-0">
          <ArticleList />
        </div>
      </main>
    </div>
  );
}

export default App;