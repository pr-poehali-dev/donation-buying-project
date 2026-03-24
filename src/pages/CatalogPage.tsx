import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface Package {
  id: number;
  name: string;
  price: number;
  emoji: string;
  color: string;
  description: string;
  popular: boolean;
  is_new: boolean;
}

const FALLBACK: Package[] = [
  { id: 1, name: "Legend Basic",    price: 19,   emoji: "⚔️", color: "from-slate-500 to-gray-600",    description: "Начальный статус легенды",          popular: false, is_new: false },
  { id: 2, name: "Legend Gold",     price: 199,  emoji: "🥇", color: "from-yellow-500 to-amber-400",  description: "Золотой статус для избранных",      popular: false, is_new: false },
  { id: 3, name: "Legend Platinum", price: 499,  emoji: "💠", color: "from-cyan-400 to-blue-500",     description: "Платиновый уровень престижа",       popular: true,  is_new: false },
  { id: 4, name: "Legend Diamond",  price: 999,  emoji: "💎", color: "from-purple-500 to-pink-500",   description: "Редкий алмазный статус",            popular: false, is_new: false },
  { id: 5, name: "Временный Админ", price: 4999, emoji: "👑", color: "from-red-500 to-orange-500",    description: "Права администратора на сервере",   popular: false, is_new: true  },
];

interface CatalogPageProps {
  onNavigate: (page: string) => void;
}

export default function CatalogPage({ onNavigate }: CatalogPageProps) {
  const { user } = useAuth();
  const [packages, setPackages] = useState<Package[]>(FALLBACK);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);

  useEffect(() => {
    if (user) {
      api.getPackages()
        .then(d => setPackages(d.packages))
        .catch(() => {});
    }
  }, [user]);

  const applyPromo = async () => {
    if (!user) { onNavigate("auth"); return; }
    setPromoLoading(true);
    setPromoError("");
    try {
      const data = await api.checkPromo(promoCode);
      setDiscount(data.discount_percent);
      setPromoApplied(true);
    } catch (e: unknown) {
      setPromoError(e instanceof Error ? e.message : "Промокод не найден");
      setPromoApplied(false);
      setDiscount(0);
    } finally {
      setPromoLoading(false);
    }
  };

  const getPrice = (price: number) => {
    if (promoApplied && discount > 0) return Math.round(price * (1 - discount / 100));
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
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-2 left-4 badge-popular px-3 py-0.5 rounded-full text-xs font-bold">
                  🔥 ПОПУЛЯРНОЕ
                </div>
              )}
              {pkg.is_new && (
                <div className="absolute -top-2 left-4 badge-new px-3 py-0.5 rounded-full text-xs font-bold">
                  ✨ НОВИНКА
                </div>
              )}

              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${pkg.color} flex items-center justify-center text-2xl mb-4 shadow-lg`}>
                {pkg.emoji}
              </div>

              <h3 className="font-game text-white text-xl mb-1">{pkg.name}</h3>
              <p className="text-gray-500 text-sm mb-4">{pkg.description}</p>

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
                  selectedPackage === pkg.id ? "border-purple-400 bg-purple-400" : "border-gray-600"
                }`}>
                  {selectedPackage === pkg.id && <Icon name="Check" size={14} className="text-white" />}
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
              <button
                onClick={() => !user && onNavigate("auth")}
                className="w-full btn-gradient text-white font-game py-3 rounded-xl relative overflow-hidden"
              >
                <span className="relative z-10">
                  {user ? "⚡ Купить сейчас" : "🔐 Войди для покупки"}
                </span>
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
              onChange={e => { setPromoCode(e.target.value); setPromoApplied(false); setPromoError(""); }}
              placeholder="Введи промокод..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors"
            />
            <button
              onClick={applyPromo}
              disabled={promoLoading || !promoCode}
              className="btn-gradient text-white font-game px-6 py-3 rounded-xl relative overflow-hidden disabled:opacity-50"
            >
              <span className="relative z-10 flex items-center gap-2">
                {promoLoading && <Icon name="Loader2" size={15} className="animate-spin" />}
                Применить
              </span>
            </button>
          </div>
          {promoApplied && (
            <div className="mt-3 flex items-center gap-2 text-green-400">
              <Icon name="CheckCircle" size={16} />
              <span className="text-sm">Промокод применён! Скидка {discount}%</span>
            </div>
          )}
          {promoError && (
            <div className="mt-3 flex items-center gap-2 text-red-400">
              <Icon name="XCircle" size={16} />
              <span className="text-sm">{promoError}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
