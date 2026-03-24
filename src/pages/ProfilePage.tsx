import { useState } from "react";
import Icon from "@/components/ui/icon";

const achievements = [
  { icon: "🏆", name: "Первая покупка", desc: "Совершил первую транзакцию", unlocked: true },
  { icon: "💎", name: "Коллекционер", desc: "Купил 1000+ монет", unlocked: true },
  { icon: "⚡", name: "Молния", desc: "5 покупок за неделю", unlocked: true },
  { icon: "🔥", name: "На огне", desc: "Покупки 7 дней подряд", unlocked: false },
  { icon: "🌟", name: "VIP клиент", desc: "Потратил 10 000 ₽", unlocked: false },
  { icon: "👑", name: "Легенда", desc: "Потратил 50 000 ₽", unlocked: false },
];

export default function ProfilePage() {
  const [nickname, setNickname] = useState("GamerPro2026");
  const [email, setEmail] = useState("user@example.com");
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <h1 className="font-game text-4xl mb-2">
            ЛИЧНЫЙ <span className="gradient-text">КАБИНЕТ</span>
          </h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div className="card-glow rounded-2xl p-6 text-center">
              <div className="relative inline-block mb-4">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 flex items-center justify-center text-4xl mx-auto animate-pulse-glow">
                  🎮
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-400 rounded-full border-2 border-[#0a0b14] flex items-center justify-center">
                  <span className="text-[10px] text-black font-bold">●</span>
                </div>
              </div>
              <h2 className="font-game text-xl text-white mb-1">{nickname}</h2>
              <p className="text-gray-500 text-sm mb-4">{email}</p>
              <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 rounded-full px-4 py-1.5">
                <span className="text-purple-300 text-sm">⚡ VIP Уровень 3</span>
              </div>
            </div>

            <div className="card-glow-gold rounded-2xl p-5">
              <h3 className="font-game text-yellow-400 mb-4">💎 Мой баланс</h3>
              <div className="text-4xl font-game gradient-text-gold mb-1">1 250</div>
              <div className="text-gray-500 text-sm mb-4">донат-монет</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <div className="text-white font-game">7</div>
                  <div className="text-gray-500 text-xs">Покупок</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <div className="text-green-400 font-game">320₽</div>
                  <div className="text-gray-500 text-xs">Сэкономлено</div>
                </div>
              </div>
            </div>

            <div className="card-glow rounded-2xl p-5">
              <h3 className="font-game text-white mb-3">🎁 Реферальная ссылка</h3>
              <div className="bg-white/5 border border-dashed border-purple-500/30 rounded-xl p-3 flex items-center justify-between gap-2">
                <span className="text-gray-400 text-xs truncate">donatezone.ru/r/GPRO26</span>
                <button className="text-purple-400 hover:text-purple-300 transition-colors flex-shrink-0">
                  <Icon name="Copy" size={15} />
                </button>
              </div>
              <p className="text-gray-600 text-xs mt-2">Приведи друга — получи 50 монет!</p>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="card-glow rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-game text-white text-xl">Данные профиля</h3>
                <button
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    isEditing ? "btn-gradient text-white" : "card-glow text-gray-400 hover:text-white"
                  }`}
                >
                  <Icon name={isEditing ? "Save" : "Edit2"} size={15} />
                  {isEditing ? "Сохранить" : "Изменить"}
                </button>
              </div>

              {saved && (
                <div className="mb-4 flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl p-3 text-green-400 text-sm animate-fade-in">
                  <Icon name="CheckCircle" size={16} />
                  Профиль успешно обновлён!
                </div>
              )}

              <div className="space-y-4">
                {[
                  { label: "Никнейм", value: nickname, setter: setNickname, type: "text", icon: "User" },
                  { label: "Email", value: email, setter: setEmail, type: "email", icon: "Mail" },
                ].map((field, i) => (
                  <div key={i}>
                    <label className="text-gray-500 text-sm mb-2 flex items-center gap-2">
                      <Icon name={field.icon} size={14} />
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      value={field.value}
                      onChange={e => field.setter(e.target.value)}
                      disabled={!isEditing}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white disabled:text-gray-500 focus:outline-none focus:border-purple-500/50 transition-all"
                    />
                  </div>
                ))}

                <div>
                  <label className="text-gray-500 text-sm mb-2 flex items-center gap-2">
                    <Icon name="Lock" size={14} />
                    Пароль
                  </label>
                  <input
                    type="password"
                    value="••••••••"
                    disabled={!isEditing}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white disabled:text-gray-500 focus:outline-none"
                    readOnly
                  />
                </div>
              </div>
            </div>

            <div className="card-glow rounded-2xl p-6">
              <h3 className="font-game text-white text-xl mb-6">🏆 Достижения</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {achievements.map((ach, i) => (
                  <div
                    key={i}
                    className={`rounded-xl p-4 text-center transition-all ${
                      ach.unlocked
                        ? "card-glow border border-yellow-500/20"
                        : "bg-white/2 border border-white/5 opacity-40"
                    }`}
                  >
                    <div className={`text-3xl mb-2 ${!ach.unlocked && "grayscale"}`}>{ach.icon}</div>
                    <div className={`font-game text-sm mb-1 ${ach.unlocked ? "text-white" : "text-gray-600"}`}>
                      {ach.name}
                    </div>
                    <div className="text-gray-600 text-xs">{ach.desc}</div>
                    {ach.unlocked && (
                      <div className="mt-2 text-yellow-500 text-xs flex items-center justify-center gap-1">
                        <Icon name="Star" size={10} />
                        Получено
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
