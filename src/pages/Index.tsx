import { useState } from "react";
import Navbar from "@/components/Navbar";
import HomePage from "@/pages/HomePage";
import CatalogPage from "@/pages/CatalogPage";
import HistoryPage from "@/pages/HistoryPage";
import ProfilePage from "@/pages/ProfilePage";
import SupportPage from "@/pages/SupportPage";
import AuthPage from "@/pages/AuthPage";
import AdminPage from "@/pages/AdminPage";
import { AuthProvider } from "@/context/AuthContext";

function AppContent() {
  const [currentPage, setCurrentPage] = useState("home");

  const renderPage = () => {
    switch (currentPage) {
      case "home":    return <HomePage onNavigate={setCurrentPage} />;
      case "catalog": return <CatalogPage onNavigate={setCurrentPage} />;
      case "history": return <HistoryPage />;
      case "profile": return <ProfilePage />;
      case "support": return <SupportPage />;
      case "auth":    return <AuthPage onNavigate={setCurrentPage} />;
      case "admin":   return <AdminPage />;
      default:        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main>{renderPage()}</main>

      <footer className="border-t border-white/5 py-8 px-4 mt-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg btn-gradient flex items-center justify-center">
              <span className="text-white font-game text-xs">DZ</span>
            </div>
            <span className="font-game gradient-text">DonateZone</span>
          </div>
          <p className="text-gray-600 text-sm">© 2026 DonateZone. Все права защищены.</p>
          <div className="flex gap-6 text-gray-600 text-sm">
            <button className="hover:text-gray-400 transition-colors">Политика</button>
            <button className="hover:text-gray-400 transition-colors">Условия</button>
            <button onClick={() => setCurrentPage("support")} className="hover:text-gray-400 transition-colors">Поддержка</button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function Index() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
