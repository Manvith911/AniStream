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

// ✅ Supabase Auth and new pages
import AuthCallback from "./pages/AuthCallback";
import ProfilePage from "./pages/ProfilePage";
import WatchlistPage from "./pages/WatchlistPage";

// ✅ Import from Vercel
import { Analytics } from "@vercel/analytics/react";

const App = () => {
  const isSidebarOpen = useSidebarStore((state) => state.isSidebarOpen);
  const togglesidebar = useSidebarStore((state) => state.toggleSidebar);
  const location = useLocation();
  const path = location.pathname === "/";

  return (
    <>
      {/* Sidebar (hidden on root page) */}
      {!path && <Sidebar />}

      <main className={`${isSidebarOpen ? "bg-active" : ""} opacityWrapper`}>
        {/* Background overlay when sidebar is open */}
        <div
          onClick={togglesidebar}
          className={`${isSidebarOpen ? "active" : ""} opacityBg`}
        ></div>

        {/* Header (hidden on root page) */}
        {!path && <Header />}

        <ScrollToTop />

        {/* ✅ Routes */}
        <Routes>
          <Route path="/" element={<Root />} />
          <Route path="/home" element={<Home />} />
          <Route path="/anime/:id" element={<DetailPage />} />
          <Route path="/animes/:category/:query?" element={<ListPage />} />
          <Route path="/search" element={<SearchResult />} />
          <Route path="/watch/:id" element={<WatchPage />} />
          <Route path="/characters/:id" element={<CharactersPage />} />
          <Route path="/people/:id" element={<PeopleInfoPage />} />
          <Route path="/character/:id" element={<CharacterInfoPage />} />

          {/* ✅ Supabase Auth Callback */}
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* ✅ User Pages */}
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/watchlist" element={<WatchlistPage />} />

          {/* 404 Fallback */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </main>

      {/* ✅ Add Vercel Analytics at root */}
      <Analytics />
    </>
  );
};

export default App;
