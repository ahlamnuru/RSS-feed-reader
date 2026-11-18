import Header from "./components/layout/header";
import FeedForm from "./components/feeds/FeedForm";
import FeedList from "./components/feeds/FeedList";
import ArticleList from "./components/articles/ArticleList";

function App() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <Header />

      <div className="mx-auto grid max-w-6xl gap-6 p-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <div className="space-y-6">
          <FeedForm />
          <FeedList />
        </div>

        <ArticleList />
      </div>
    </main>
  );
}

export default App;