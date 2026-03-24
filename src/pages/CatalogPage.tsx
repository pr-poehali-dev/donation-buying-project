import { useState } from "react";
import Icon from "@/components/ui/icon";

const games = [
  { id: "all", name: "Все игры", icon: "🎮" },
  { id: "minecraft", name: "Minecraft", icon: "⛏️" },
  { id: "fortnite", name: "Fortnite", icon: "🔫" },
  { id: "roblox", name: "Roblox", icon: "🧱" },
  { id: "genshin", name: "Genshin Impact", icon: "⚔️" },
  { id: "cs2", name: "CS2", icon: "💣" },
];

const packages = [
  { id: 1, game: "minecraft", name: "Стартовый", coins: 100, price: 99, bonus: 0, popular: false, isNew: true, color: "from-green-500 to-emerald-500", emoji: "⛏️" },
  { id: 2, game: "minecraft", name: "Базовый", coins: 500, price: 399, bonus: 5, popular: false, isNew: false, color: "from-blue-500 to-cyan-500", emoji: "⛏️" },
  { id: 3, game: "minecraft", name: "Продвинутый", coins: 1200, price: 799, bonus: 20, popular: true, isNew: false, color: "from-purple-500 to-violet-500", emoji: "⛏️" },
  { id: 4, game: "minecraft", name: "Премиум", coins: 3000, price: 1799, bonus: 35, popular: false, isNew: false, color: "from-yellow-500 to-orange-500", emoji: "⛏️" },
  { id: 5, game: "fortnite", name: "V-Bucks 1000", coins: 1000, price: 699, bonus: 0, popular: false, isNew: false, color: "from-blue-400 to-indigo-500", emoji: "🔫" },
  { id: 6, game: "fortnite", name: "V-Bucks 2800", coins: 2800, price: 1799, bonus: 12, popular: true, isNew: false, color: "from-purple-400 to-blue-500", emoji: "🔫" },
  { id: 7, game: "roblox", name: "Robux 400", coins: 400, price: 299, bonus: 0, popular: false, isNew: false, color: "from-red-500 to-orange-500", emoji: "🧱" },
  { id: 8, game: "roblox", name: "Robux 1700", coins: 1700, price: 999, bonus: 15, popular: true, isNew: false, color: "from-pink-500 to-red-500", emoji: "🧱" },
  { id: 9, game: "genshin", name: "Genesis Crystals 60", coins: 60, price: 99, bonus: 0, popular: false, isNew: true, color: "from-indigo-500 to-purple-500", emoji: "⚔️" },
  { id: 10, game: "genshin", name: "Genesis Crystals 980", coins: 980, price: 1499, bonus: 10, popular: true, isNew: false, color: "from-violet-500 to-indigo-500", emoji: "⚔️" },
  { id: 11, game: "cs2", name: "500 очков", coins: 500, price: 499, bonus: 0, popular: false, isNew: false, color: "from-orange-500 to-yellow-500", emoji: "💣" },
  { id: 12, game: "cs2", name: "2000 очков", coins: 2000, price: 1699, bonus: 18, popular: true, isNew: false, color: "from-yellow-500 to-amber-500", emoji: "💣" },
];

interface CatalogPageProps {
  onNavigate: (page: string) => void;
}

export default function CatalogPage({ onNavigate }: CatalogPageProps) {
  const [selectedGame, setSelectedGame] = useState("all");
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);

  const filtered = selectedGame === "all" ? packages : packages.filter(p => p.game === selectedGame);

  const applyPromo = () => {
    if (promoCode.toUpperCase() === "WELCOME20" || promoCode.toUpperCase() === "SAVE10") {
      setPromoApplied(true);
      setPromoError(false);
    } else {
      setPromoError(true);
      setPromoApplied(false);
    }
  };

  const getPrice = (price: number) => {
    if (promoApplied) return Math.round(price * 0.8);
    return price;
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="font-game text-4xl mb-2">
            КАТАЛОГ <span className="gradient-text">ДОНАТОВ</span>
          </h1>
          <p className="text-gray-400">Выбери игру и пакет, который тебе нужен</p>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          {games.map(g => (
            <button
              key={g.id}
              onClick={() => setSelectedGame(g.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
                selectedGame === g.id
                  ? "btn-gradient text-white glow-purple"
                  : "card-glow text-gray-400 hover:text-white"
              }`}
            >
              <span>{g.icon}</span>
              {g.name}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-10">
          {filtered.map((pkg) => (
            <div
              key={pkg.id}
              onClick={() => setSelectedPackage(pkg.id === selectedPackage ? null : pkg.id)}
              className={`relative card-glow rounded-2xl p-5 cursor-pointer transition-all ${
                selectedPackage === pkg.id ? "border-purple-400/60 shadow-lg shadow-purple-500/20" : ""
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-2 left-4 badge-popular px-3 py-0.5 rounded-full text-xs font-bold">
                  🔥 ПОПУЛЯРНОЕ
                </div>
              )}
              {pkg.isNew && (
                <div className="absolute -top-2 left-4 badge-new px-3 py-0.5 rounded-full text-xs font-bold">
                  ✨ НОВИНКА
                </div>
              )}

              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${pkg.color} flex items-center justify-center text-2xl mb-4 shadow-lg`}>
                {pkg.emoji}
              </div>

              <h3 className="font-game text-white text-lg mb-1">{pkg.name}</h3>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-yellow-400 font-game text-xl">💎 {pkg.coins.toLocaleString()}</span>
                {pkg.bonus > 0 && (
                  <span className="badge-new px-2 py-0.5 rounded-full text-xs">+{pkg.bonus}%</span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div>
                  {promoApplied && (
                    <span className="text-gray-500 line-through text-sm">{pkg.price} ₽</span>
                  )}
                  <span className="text-white font-game text-xl block">
                    {getPrice(pkg.price)} ₽
                  </span>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  selectedPackage === pkg.id
                    ? "border-purple-400 bg-purple-400"
                    : "border-gray-600"
                }`}>
                  {selectedPackage === pkg.id && (
                    <Icon name="Check" size={12} className="text-white" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedPackage && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-md px-4 animate-slide-up">
            <div className="card-glow rounded-2xl p-4 border border-purple-500/40 shadow-2xl shadow-purple-500/20">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-gray-400 text-sm">Выбрано:</p>
                  <p className="text-white font-game">
                    {packages.find(p => p.id === selectedPackage)?.name}
                  </p>
                </div>
                <p className="font-game text-xl text-white">
                  {getPrice(packages.find(p => p.id === selectedPackage)?.price || 0)} ₽
                </p>
              </div>
              <button className="w-full btn-gradient text-white font-game py-3 rounded-xl relative overflow-hidden">
                <span className="relative z-10">⚡ Купить сейчас</span>
              </button>
            </div>
          </div>
        )}

        <div className="card-glow rounded-2xl p-6">
          <h3 className="font-game text-white text-xl mb-4">🎁 Промокод</h3>
          <div className="flex gap-3">
            <input
              type="text"
              value={promoCode}
              onChange={e => setPromoCode(e.target.value)}
              placeholder="Введи промокод..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors"
            />
            <button
              onClick={applyPromo}
              className="btn-gradient text-white font-game px-6 py-3 rounded-xl relative overflow-hidden"
            >
              <span className="relative z-10">Применить</span>
            </button>
          </div>
          {promoApplied && (
            <div className="mt-3 flex items-center gap-2 text-green-400">
              <Icon name="CheckCircle" size={16} />
              <span className="text-sm">Промокод применён! Скидка 20%</span>
            </div>
          )}
          {promoError && (
            <div className="mt-3 flex items-center gap-2 text-red-400">
              <Icon name="XCircle" size={16} />
              <span className="text-sm">Промокод не найден или истёк</span>
            </div>
          )}
          <p className="text-gray-600 text-xs mt-3">Попробуй: WELCOME20 или SAVE10</p>
        </div>
      </div>
    </div>
  );
}
