import { useState } from "react";
import Icon from "@/components/ui/icon";

const packages = [
  { id: 1, name: "Legend Basic", price: 19, popular: false, isNew: false, color: "from-slate-500 to-gray-600", emoji: "⚔️", desc: "Начальный статус легенды" },
  { id: 2, name: "Legend Gold", price: 199, popular: false, isNew: false, color: "from-yellow-500 to-amber-400", emoji: "🥇", desc: "Золотой статус для избранных" },
  { id: 3, name: "Legend Platinum", price: 499, popular: true, isNew: false, color: "from-cyan-400 to-blue-500", emoji: "💠", desc: "Платиновый уровень престижа" },
  { id: 4, name: "Legend Diamond", price: 999, popular: false, isNew: false, color: "from-purple-500 to-pink-500", emoji: "💎", desc: "Редкий алмазный статус" },
  { id: 5, name: "Временный Админ", price: 4999, popular: false, isNew: true, color: "from-red-500 to-orange-500", emoji: "👑", desc: "Права администратора на сервере" },
];

interface CatalogPageProps {
  onNavigate: (page: string) => void;
}

export default function CatalogPage({ onNavigate: _onNavigate }: CatalogPageProps) {
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);

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
    <div className="min-h-screen pt-24 pb-32 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <h1 className="font-game text-4xl mb-2">
            КАТАЛОГ <span className="gradient-text">ДОНАТОВ</span>
          </h1>
          <p className="text-gray-400">Выбери пакет и получи статус мгновенно</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              onClick={() => setSelectedPackage(pkg.id === selectedPackage ? null : pkg.id)}
              className={`relative card-glow rounded-2xl p-6 cursor-pointer transition-all ${
                selectedPackage === pkg.id ? "border-purple-400/60 shadow-lg shadow-purple-500/20" : ""
              } ${pkg.name === "Временный Админ" ? "md:col-span-2 lg:col-span-1" : ""}`}
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

              <h3 className="font-game text-white text-xl mb-1">{pkg.name}</h3>
              <p className="text-gray-500 text-sm mb-4">{pkg.desc}</p>

              <div className="flex items-center justify-between">
                <div>
                  {promoApplied && (
                    <span className="text-gray-500 line-through text-sm block">{pkg.price} ₽</span>
                  )}
                  <span className="text-white font-game text-2xl">
                    {getPrice(pkg.price)} ₽
                  </span>
                </div>
                <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                  selectedPackage === pkg.id
                    ? "border-purple-400 bg-purple-400"
                    : "border-gray-600"
                }`}>
                  {selectedPackage === pkg.id && (
                    <Icon name="Check" size={14} className="text-white" />
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
        </div>
      </div>
    </div>
  );
}
