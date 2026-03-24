import { useState } from "react";
import Icon from "@/components/ui/icon";

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { id: "home", label: "Главная", icon: "Home" },
    { id: "catalog", label: "Каталог", icon: "ShoppingBag" },
    { id: "history", label: "История", icon: "History" },
    { id: "profile", label: "Профиль", icon: "User" },
    { id: "support", label: "Поддержка", icon: "MessageCircle" },
  ];

  return (
    <nav className="nav-blur fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center gap-2 group"
          >
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
            <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-3 py-1.5">
              <span className="text-yellow-400 text-sm">💎</span>
              <span className="text-yellow-400 font-game text-sm">1 250</span>
            </div>
            <button
              onClick={() => onNavigate("profile")}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold"
            >
              А
            </button>
          </div>

          <button
            className="md:hidden text-gray-400 hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
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
                  currentPage === link.id
                    ? "bg-purple-500/20 text-purple-300"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon name={link.icon} size={18} />
                {link.label}
              </button>
            ))}
            <div className="pt-2 flex items-center gap-2 px-4">
              <span className="text-yellow-400">💎</span>
              <span className="text-yellow-400 font-game">1 250 монет</span>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}