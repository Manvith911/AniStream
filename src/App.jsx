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
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import WatchlistPage from "./pages/WatchlistPage";
import ProtectedRoute from "./components/ProtectedRoute";
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
        <div
          onClick={toggleSidebar}
          className={`${isSidebarOpen ? "active" : ""} opacityBg`}
        ></div>

        {!isRootPath && <Header />}

        <ScrollToTop />

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

          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/watchlist"
            element={
              <ProtectedRoute>
                <WatchlistPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </main>

      <Analytics />
    </>
  );
};

export default App;
