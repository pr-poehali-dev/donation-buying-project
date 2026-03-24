import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import Icon from "@/components/ui/icon";

interface Package {
  id: number;
  name: string;
  price: number;
  emoji: string;
  active: boolean;
}

interface Promo {
  id: number;
  code: string;
  discount_percent: number;
  active: boolean;
  usage_limit: number | null;
  used_count: number;
}

interface AppUser {
  id: number;
  username: string;
  email: string;
  rank: string;
  created_at: string;
}

const RANK_LABELS: Record<string, { label: string; color: string; icon: string }> = {
  owner:   { label: "Владелец", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30", icon: "👑" },
  admin:   { label: "Админ",    color: "text-purple-400 bg-purple-500/10 border-purple-500/30", icon: "🛡️" },
  support: { label: "Поддержка",color: "text-blue-400 bg-blue-500/10 border-blue-500/30",     icon: "🎧" },
  user:    { label: "Пользователь", color: "text-gray-400 bg-white/5 border-white/10",         icon: "👤" },
};

export default function AdminPage() {
  const { user } = useAuth();
  const isAdmin = user?.rank === "admin" || user?.rank === "owner";
  const isOwner = user?.rank === "owner";

  const [tab, setTab] = useState<"packages" | "promos" | "users">("packages");
  const [packages, setPackages] = useState<Package[]>([]);
  const [promos, setPromos] = useState<Promo[]>([]);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [editPkg, setEditPkg] = useState<{ id: number; name: string } | null>(null);
  const [newPromo, setNewPromo] = useState({ code: "", discount: "", limit: "" });
  const [message, setMessage] = useState("");

  const showMsg = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 2500);
  };

  useEffect(() => {
    if (!isAdmin) return;
    setLoading(true);
    if (tab === "packages") {
      api.getPackages().then(d => setPackages(d.packages)).finally(() => setLoading(false));
    } else if (tab === "promos") {
      api.getPromos().then(d => setPromos(d.promos)).finally(() => setLoading(false));
    } else if (tab === "users" && isOwner) {
      api.getUsers().then(d => setUsers(d.users)).finally(() => setLoading(false));
    }
  }, [tab, isAdmin, isOwner]);

  const savePackage = async () => {
    if (!editPkg) return;
    await api.updatePackage(editPkg.id, editPkg.name);
    setPackages(p => p.map(pkg => pkg.id === editPkg.id ? { ...pkg, name: editPkg.name } : pkg));
    setEditPkg(null);
    showMsg("✅ Название обновлено");
  };

  const createPromo = async () => {
    await api.createPromo(newPromo.code, Number(newPromo.discount), newPromo.limit ? Number(newPromo.limit) : undefined);
    setNewPromo({ code: "", discount: "", limit: "" });
    api.getPromos().then(d => setPromos(d.promos));
    showMsg("✅ Промокод создан");
  };

  const togglePromo = async (id: number, active: boolean) => {
    await api.updatePromo(id, { active: !active });
    setPromos(p => p.map(pr => pr.id === id ? { ...pr, active: !active } : pr));
  };

  const setRank = async (uid: number, rank: string) => {
    await api.setRank(uid, rank);
    setUsers(u => u.map(us => us.id === uid ? { ...us, rank } : us));
    showMsg("✅ Ранг изменён");
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="font-game text-2xl text-red-400">Нет доступа</h2>
          <p className="text-gray-500 mt-2">Эта страница только для администраторов</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "packages", label: "Донаты", icon: "Package" },
    { id: "promos", label: "Промокоды", icon: "Tag" },
    ...(isOwner ? [{ id: "users", label: "Пользователи", icon: "Users" }] : []),
  ] as const;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl btn-gradient flex items-center justify-center text-xl glow-purple">
            {RANK_LABELS[user?.rank || "admin"].icon}
          </div>
          <div>
            <h1 className="font-game text-3xl gradient-text">ПАНЕЛЬ УПРАВЛЕНИЯ</h1>
            <p className="text-gray-500 text-sm">{RANK_LABELS[user?.rank || "admin"].label} · {user?.username}</p>
          </div>
        </div>

        {message && (
          <div className="mb-4 bg-green-500/10 border border-green-500/20 rounded-xl p-3 text-green-400 text-sm flex items-center gap-2 animate-fade-in">
            {message}
          </div>
        )}

        <div className="flex gap-2 mb-6">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as typeof tab)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                tab === t.id ? "btn-gradient text-white" : "card-glow text-gray-400 hover:text-white"
              }`}
            >
              <Icon name={t.icon} size={16} />
              {t.label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <Icon name="Loader2" size={32} className="text-purple-400 animate-spin" />
          </div>
        )}

        {!loading && tab === "packages" && (
          <div className="space-y-3">
            {packages.map(pkg => (
              <div key={pkg.id} className="card-glow rounded-2xl p-5 flex items-center justify-between gap-4">
                {editPkg?.id === pkg.id ? (
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-2xl">{pkg.emoji}</span>
                    <input
                      value={editPkg.name}
                      onChange={e => setEditPkg({ ...editPkg, name: e.target.value })}
                      className="flex-1 bg-white/5 border border-purple-500/40 rounded-xl px-3 py-2 text-white focus:outline-none"
                      autoFocus
                    />
                    <button onClick={savePackage} className="btn-gradient text-white px-4 py-2 rounded-xl text-sm font-medium relative overflow-hidden">
                      <span className="relative z-10">Сохранить</span>
                    </button>
                    <button onClick={() => setEditPkg(null)} className="text-gray-500 hover:text-white transition-colors">
                      <Icon name="X" size={18} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{pkg.emoji}</span>
                      <div>
                        <p className="font-game text-white">{pkg.name}</p>
                        <p className="text-gray-500 text-sm">{pkg.price} ₽</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setEditPkg({ id: pkg.id, name: pkg.name })}
                      className="flex items-center gap-2 text-gray-400 hover:text-purple-300 transition-colors text-sm"
                    >
                      <Icon name="Edit2" size={15} />
                      Изменить
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {!loading && tab === "promos" && (
          <div className="space-y-4">
            <div className="card-glow rounded-2xl p-5">
              <h3 className="font-game text-white mb-4">➕ Новый промокод</h3>
              <div className="grid sm:grid-cols-3 gap-3 mb-3">
                <input
                  placeholder="КОД"
                  value={newPromo.code}
                  onChange={e => setNewPromo(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/40"
                />
                <input
                  placeholder="Скидка %"
                  type="number"
                  value={newPromo.discount}
                  onChange={e => setNewPromo(p => ({ ...p, discount: e.target.value }))}
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/40"
                />
                <input
                  placeholder="Лимит (необязательно)"
                  type="number"
                  value={newPromo.limit}
                  onChange={e => setNewPromo(p => ({ ...p, limit: e.target.value }))}
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/40"
                />
              </div>
              <button
                onClick={createPromo}
                disabled={!newPromo.code || !newPromo.discount}
                className="btn-gradient text-white font-game px-6 py-2.5 rounded-xl relative overflow-hidden disabled:opacity-40"
              >
                <span className="relative z-10">Создать</span>
              </button>
            </div>

            {promos.map(pr => (
              <div key={pr.id} className="card-glow rounded-2xl p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-2.5 h-2.5 rounded-full ${pr.active ? "bg-green-400" : "bg-gray-600"}`} />
                  <div>
                    <p className="font-game text-white tracking-wider">{pr.code}</p>
                    <p className="text-gray-500 text-sm">
                      -{pr.discount_percent}% · Использовано: {pr.used_count}{pr.usage_limit ? `/${pr.usage_limit}` : ""}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => togglePromo(pr.id, pr.active)}
                  className={`px-4 py-1.5 rounded-xl text-sm font-medium border transition-all ${
                    pr.active
                      ? "text-red-400 border-red-500/30 hover:bg-red-500/10"
                      : "text-green-400 border-green-500/30 hover:bg-green-500/10"
                  }`}
                >
                  {pr.active ? "Деактивировать" : "Активировать"}
                </button>
              </div>
            ))}
          </div>
        )}

        {!loading && tab === "users" && isOwner && (
          <div className="space-y-3">
            {users.map(u => {
              const rankInfo = RANK_LABELS[u.rank] || RANK_LABELS.user;
              return (
                <div key={u.id} className="card-glow rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                      {u.username[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-game text-white">{u.username}</p>
                      <p className="text-gray-500 text-xs">{u.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full border text-xs font-medium ${rankInfo.color}`}>
                      {rankInfo.icon} {rankInfo.label}
                    </span>
                    {u.rank !== "owner" && (
                      <select
                        value={u.rank}
                        onChange={e => setRank(u.id, e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-gray-300 text-sm focus:outline-none focus:border-purple-500/40"
                      >
                        <option value="user">Пользователь</option>
                        <option value="support">Техподдержка</option>
                        <option value="admin">Админ</option>
                      </select>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
