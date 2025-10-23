import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Root from "./pages/Root";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import useSidebarStore from "./store/sidebarStore";
import ListPage from "./pages/ListPage";
import DetailPage from "./pages/DetailPage";
import ScrollToTop from "./utils/ScrollToTop";
import SearchResult from "./pages/SearchResult";
import WatchPage from "./pages/WatchPage";
import PageNotFound from "./pages/PageNotFound";
import PeopleInfoPage from "./pages/PeopleInfoPage";
import CharacterInfoPage from "./pages/CharacterInfoPage";
import CharactersPage from "./pages/CharactersPage";
import ProfilePage from "./pages/ProfilePage"; // ✅ new
import AuthPage from "./pages/AuthPage"; // ✅ new

// ✅ Import from Vercel
import { Analytics } from "@vercel/analytics/react";

const App = () => {
  const isSidebarOpen = useSidebarStore((state) => state.isSidebarOpen);
  const toggleSidebar = useSidebarStore((state) => state.toggleSidebar);
  const location = useLocation();
  const isRootPath = location.pathname === "/";

  return (
    <>
      {!isRootPath && <Sidebar />}

      <main className={`${isSidebarOpen ? "bg-active" : ""} opacityWrapper`}>
        {/* Overlay when sidebar is open */}
        <div
          onClick={toggleSidebar}
          className={`${isSidebarOpen ? "active" : ""} opacityBg`}
        ></div>

        {/* Header (hidden on root page) */}
        {!isRootPath && <Header />}

        <ScrollToTop />

        <Routes>
          {/* Root */}
          <Route path="/" element={<Root />} />

          {/* Home + Lists */}
          <Route path="/home" element={<Home />} />
          <Route path="/animes/:category/:query?" element={<ListPage />} />

          {/* Anime Details + Watching */}
          <Route path="/anime/:id" element={<DetailPage />} />
          <Route path="/watch/:id" element={<WatchPage />} />

          {/* Search */}
          <Route path="/search" element={<SearchResult />} />

          {/* Characters & People */}
          <Route path="/characters/:id" element={<CharactersPage />} />
          <Route path="/character/:id" element={<CharacterInfoPage />} />
          <Route path="/people/:id" element={<PeopleInfoPage />} />

          {/* ✅ Auth + Profile Pages */}
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          {/* 404 */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </main>

      {/* ✅ Analytics (Vercel) */}
      <Analytics />
    </>
  );
};

export default App;
