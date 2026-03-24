import { useState } from "react";
import Icon from "@/components/ui/icon";
import { useAuth } from "@/context/AuthContext";

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const RANK_BADGE: Record<string, { label: string; color: string }> = {
  owner:   { label: "👑 Владелец", color: "text-yellow-400 border-yellow-500/30 bg-yellow-500/10" },
  admin:   { label: "🛡️ Админ",   color: "text-purple-300 border-purple-500/30 bg-purple-500/10" },
  support: { label: "🎧 Поддержка",color: "text-blue-300 border-blue-500/30 bg-blue-500/10" },
  user:    { label: "",             color: "" },
};

const baseLinks = [
  { id: "home", label: "Главная", icon: "Home" },
  { id: "catalog", label: "Каталог", icon: "ShoppingBag" },
  { id: "history", label: "История", icon: "History" },
  { id: "support", label: "Поддержка", icon: "MessageCircle" },
];

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const links = [
    ...baseLinks,
    ...(user && (user.rank === "admin" || user.rank === "owner")
      ? [{ id: "admin", label: "Панель", icon: "Shield" }]
      : []),
  ];

  const badge = user ? RANK_BADGE[user.rank] : null;

  return (
    <nav className="nav-blur fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => onNavigate("home")} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg btn-gradient flex items-center justify-center glow-purple">
              <span className="text-white font-game text-sm">DZ</span>
            </div>
            <span className="font-game text-xl gradient-text">DonateZone</span>
          </button>

          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentPage === link.id
                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon name={link.icon} size={15} />
                {link.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                {badge && badge.label && (
                  <span className={`text-xs px-2.5 py-1 rounded-full border ${badge.color}`}>{badge.label}</span>
                )}
                <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-3 py-1.5">
                  <span className="text-yellow-400 text-sm">💎</span>
                  <span className="text-yellow-400 font-game text-sm">{user.balance}</span>
                </div>
                <button
                  onClick={() => onNavigate("profile")}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold"
                >
                  {user.username[0].toUpperCase()}
                </button>
                <button
                  onClick={logout}
                  className="text-gray-500 hover:text-red-400 transition-colors"
                  title="Выйти"
                >
                  <Icon name="LogOut" size={18} />
                </button>
              </>
            ) : (
              <button
                onClick={() => onNavigate("auth")}
                className="btn-gradient text-white font-game px-5 py-2 rounded-xl text-sm relative overflow-hidden"
              >
                <span className="relative z-10">Войти</span>
              </button>
            )}
          </div>

          <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setMenuOpen(!menuOpen)}>
            <Icon name={menuOpen ? "X" : "Menu"} size={22} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-white/5 bg-[#0a0b14]/95 backdrop-blur-xl">
          <div className="px-4 py-3 space-y-1">
            {links.map((link) => (
              <button
                key={link.id}
                onClick={() => { onNavigate(link.id); setMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  currentPage === link.id ? "bg-purple-500/20 text-purple-300" : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon name={link.icon} size={18} />
                {link.label}
              </button>
            ))}
            {user ? (
              <button
                onClick={() => { logout(); setMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/5 transition-all"
              >
                <Icon name="LogOut" size={18} />
                Выйти
              </button>
            ) : (
              <button
                onClick={() => { onNavigate("auth"); setMenuOpen(false); }}
                className="w-full btn-gradient text-white font-game py-3 rounded-xl relative overflow-hidden mt-2"
              >
                <span className="relative z-10">Войти / Регистрация</span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
