import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Icon from "@/components/ui/icon";

interface AuthPageProps {
  onNavigate: (page: string) => void;
}

export default function AuthPage({ onNavigate }: AuthPageProps) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await login(form.email, form.password);
      } else {
        await register(form.username, form.email, form.password);
      }
      onNavigate("home");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 rounded-2xl btn-gradient items-center justify-center mb-4 glow-purple mx-auto">
            <span className="font-game text-white text-xl">DZ</span>
          </div>
          <h1 className="font-game text-3xl gradient-text mb-2">
            {mode === "login" ? "ВОЙТИ" : "РЕГИСТРАЦИЯ"}
          </h1>
          <p className="text-gray-500 text-sm">
            {mode === "login" ? "Рады видеть тебя снова!" : "Создай аккаунт за 30 секунд"}
          </p>
        </div>

        <div className="card-glow rounded-2xl p-6">
          <div className="flex gap-2 mb-6 bg-white/5 rounded-xl p-1">
            {(["login", "register"] as const).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(""); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  mode === m ? "btn-gradient text-white" : "text-gray-500 hover:text-white"
                }`}
              >
                {m === "login" ? "Войти" : "Регистрация"}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="text-gray-500 text-sm mb-1.5 flex items-center gap-2">
                  <Icon name="User" size={14} /> Никнейм
                </label>
                <input
                  type="text"
                  value={form.username}
                  onChange={e => set("username", e.target.value)}
                  placeholder="Твой игровой никнейм"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors"
                />
              </div>
            )}

            <div>
              <label className="text-gray-500 text-sm mb-1.5 flex items-center gap-2">
                <Icon name="Mail" size={14} /> Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={e => set("email", e.target.value)}
                placeholder="your@email.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors"
              />
            </div>

            <div>
              <label className="text-gray-500 text-sm mb-1.5 flex items-center gap-2">
                <Icon name="Lock" size={14} /> Пароль
              </label>
              <input
                type="password"
                value={form.password}
                onChange={e => set("password", e.target.value)}
                placeholder={mode === "register" ? "Минимум 6 символов" : "Твой пароль"}
                onKeyDown={e => e.key === "Enter" && submit()}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm animate-fade-in">
                <Icon name="AlertCircle" size={16} />
                {error}
              </div>
            )}

            <button
              onClick={submit}
              disabled={loading}
              className="w-full btn-gradient text-white font-game py-3.5 rounded-xl relative overflow-hidden disabled:opacity-60 transition-opacity"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading && <Icon name="Loader2" size={18} className="animate-spin" />}
                {mode === "login" ? "⚡ Войти" : "🚀 Создать аккаунт"}
              </span>
            </button>
          </div>
        </div>

        <p className="text-center text-gray-600 text-sm mt-4">
          {mode === "login" ? "Нет аккаунта?" : "Уже есть аккаунт?"}{" "}
          <button
            onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            {mode === "login" ? "Зарегистрируйся" : "Войди"}
          </button>
        </p>
      </div>
    </div>
  );
}
