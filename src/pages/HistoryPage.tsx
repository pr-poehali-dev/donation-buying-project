import { useState } from "react";
import Icon from "@/components/ui/icon";

const transactions = [
  { id: "TXN-8821", date: "24 мар 2026", time: "14:32", game: "Minecraft", package: "Продвинутый", coins: 1200, price: 799, status: "success", emoji: "⛏️" },
  { id: "TXN-8820", date: "22 мар 2026", time: "09:15", game: "Fortnite", package: "V-Bucks 2800", coins: 2800, price: 1799, status: "success", emoji: "🔫" },
  { id: "TXN-8819", date: "20 мар 2026", time: "21:47", game: "Roblox", package: "Robux 400", coins: 400, price: 299, status: "success", emoji: "🧱" },
  { id: "TXN-8818", date: "18 мар 2026", time: "16:08", game: "Genshin Impact", package: "Genesis 980", coins: 980, price: 1499, status: "pending", emoji: "⚔️" },
  { id: "TXN-8817", date: "15 мар 2026", time: "11:22", game: "CS2", package: "500 очков", coins: 500, price: 499, status: "failed", emoji: "💣" },
  { id: "TXN-8816", date: "12 мар 2026", time: "20:00", game: "Minecraft", package: "Базовый", coins: 500, price: 399, status: "success", emoji: "⛏️" },
  { id: "TXN-8815", date: "10 мар 2026", time: "08:30", game: "Roblox", package: "Robux 1700", coins: 1700, price: 999, status: "success", emoji: "🧱" },
];

const statusConfig = {
  success: { label: "Выполнен", color: "text-green-400", bg: "bg-green-500/10 border-green-500/20", icon: "CheckCircle" },
  pending: { label: "В обработке", color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20", icon: "Clock" },
  failed: { label: "Ошибка", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20", icon: "XCircle" },
};

export default function HistoryPage() {
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? transactions : transactions.filter(t => t.status === filter);

  const total = transactions.filter(t => t.status === "success").reduce((sum, t) => sum + t.price, 0);
  const totalCoins = transactions.filter(t => t.status === "success").reduce((sum, t) => sum + t.coins, 0);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <h1 className="font-game text-4xl mb-2">
            ИСТОРИЯ <span className="gradient-text">ТРАНЗАКЦИЙ</span>
          </h1>
          <p className="text-gray-400">Все твои покупки в одном месте</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Всего потрачено", value: `${total.toLocaleString()} ₽`, icon: "💳" },
            { label: "Монет куплено", value: `💎 ${totalCoins.toLocaleString()}`, icon: "💎" },
            { label: "Покупок", value: transactions.filter(t => t.status === "success").length, icon: "📦" },
            { label: "Экономия", value: "320 ₽", icon: "🎁" },
          ].map((stat, i) => (
            <div key={i} className="card-glow rounded-2xl p-4">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="font-game text-white text-lg">{stat.value}</div>
              <div className="text-gray-500 text-xs mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          {[
            { id: "all", label: "Все" },
            { id: "success", label: "✅ Выполненные" },
            { id: "pending", label: "⏳ В обработке" },
            { id: "failed", label: "❌ Ошибки" },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === f.id
                  ? "btn-gradient text-white"
                  : "card-glow text-gray-400 hover:text-white"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.map((txn, i) => {
            const s = statusConfig[txn.status as keyof typeof statusConfig];
            return (
              <div
                key={txn.id}
                className="card-glow rounded-2xl p-5 flex items-center justify-between gap-4"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-2xl flex-shrink-0">
                    {txn.emoji}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-game text-white">{txn.game}</span>
                      <span className="text-gray-600 text-xs">•</span>
                      <span className="text-gray-400 text-sm">{txn.package}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>{txn.id}</span>
                      <span>{txn.date}</span>
                      <span>{txn.time}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-right hidden sm:block">
                    <div className="text-yellow-400 font-game text-sm">💎 {txn.coins}</div>
                    <div className="text-white font-medium">{txn.price} ₽</div>
                  </div>
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium ${s.bg} ${s.color}`}>
                    <Icon name={s.icon} size={12} />
                    {s.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📭</div>
            <p className="font-game text-gray-400 text-xl">Нет транзакций</p>
            <p className="text-gray-600 text-sm mt-2">По выбранному фильтру нет результатов</p>
          </div>
        )}
      </div>
    </div>
  );
}
