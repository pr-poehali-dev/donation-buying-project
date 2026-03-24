interface HomePageProps {
  onNavigate: (page: string) => void;
}

const stats = [
  { label: "Пользователей", value: "128K+", icon: "👥" },
  { label: "Транзакций", value: "3.2M", icon: "⚡" },
  { label: "Стран", value: "47", icon: "🌍" },
  { label: "Рейтинг", value: "4.9★", icon: "🏆" },
];

const features = [
  { icon: "⚡", title: "Мгновенное пополнение", desc: "Средства зачисляются за секунды после оплаты" },
  { icon: "🔐", title: "Полная безопасность", desc: "256-битное шифрование всех транзакций" },
  { icon: "🎁", title: "Промокоды и бонусы", desc: "Скидки до 30% для постоянных клиентов" },
  { icon: "💬", title: "Поддержка 24/7", desc: "Живой чат с командой в любое время" },
];

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="min-h-screen">
      <section className="relative pt-28 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="particle w-64 h-64 bg-purple-500/10 blur-3xl top-10 left-10 animate-float" />
          <div className="particle w-48 h-48 bg-blue-500/10 blur-3xl top-32 right-20 animate-float-delayed" />
          <div className="particle w-32 h-32 bg-pink-500/10 blur-2xl bottom-20 left-1/3 animate-float" />
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 rounded-full px-4 py-1.5 mb-6">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-purple-300 text-sm font-medium">Онлайн и готов к работе</span>
              </div>
              <h1 className="font-game text-5xl md:text-6xl leading-tight mb-6">
                ПОПОЛНИ <br />
                <span className="gradient-text">БАЛАНС</span><br />
                ЗА СЕКУНДЫ
              </h1>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                Крупнейшая платформа для покупки игровых донатов. Тысячи игр, мгновенное зачисление, безопасные платежи.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => onNavigate("catalog")}
                  className="btn-gradient text-white font-game px-8 py-4 rounded-xl relative overflow-hidden glow-purple"
                >
                  <span className="relative z-10">🎮 Выбрать пакет</span>
                </button>
                <button
                  onClick={() => onNavigate("support")}
                  className="border border-purple-500/40 text-purple-300 font-medium px-8 py-4 rounded-xl hover:bg-purple-500/10 transition-all"
                >
                  💬 Поддержка
                </button>
              </div>

              <div className="mt-8 flex items-center gap-6">
                <div className="flex -space-x-2">
                  {["🟣", "🔵", "🟡", "🔴"].map((c, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-[#0a0b14] flex items-center justify-center text-xs">
                      {c}
                    </div>
                  ))}
                </div>
                <p className="text-gray-400 text-sm">
                  <span className="text-white font-semibold">2 847</span> покупок сегодня
                </p>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="relative animate-float">
                <img
                  src="https://cdn.poehali.dev/projects/093524ef-716b-4c48-a994-121cdab1773c/files/6dd62da0-63eb-431f-b8b5-e4cfefc64d0f.jpg"
                  alt="DonateZone"
                  className="rounded-2xl w-full object-cover shadow-2xl border border-purple-500/20"
                  style={{ maxHeight: 400 }}
                />
                <div className="absolute -bottom-4 -left-4 card-glow rounded-xl p-4 animate-slide-up">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">⚡</span>
                    <div>
                      <p className="text-white font-game text-sm">Мгновенно</p>
                      <p className="text-gray-400 text-xs">~3 секунды</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 card-glow rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🔐</span>
                    <div>
                      <p className="text-white font-game text-sm">Безопасно</p>
                      <p className="text-gray-400 text-xs">SSL защита</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 px-4 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="font-game text-2xl gradient-text">{stat.value}</div>
                <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-game text-3xl md:text-4xl mb-4">
              ПОЧЕМУ <span className="gradient-text">DONATEZONE</span>?
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Мы создали платформу, которой доверяют сотни тысяч геймеров
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className="card-glow rounded-2xl p-6 text-center">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="font-game text-white mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden p-1" style={{ background: "linear-gradient(135deg, #a855f7, #3b82f6, #ec4899)" }}>
            <div className="bg-[#0a0b14] rounded-[22px] p-10 text-center">
              <div className="text-5xl mb-4">🎁</div>
              <h2 className="font-game text-3xl md:text-4xl mb-4">
                ПЕРВАЯ ПОКУПКА <span className="gradient-text">+20% БОНУС</span>
              </h2>
              <p className="text-gray-400 mb-8 text-lg">
                Используй промокод при первом пополнении и получи бонусные монеты!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="bg-white/5 border border-dashed border-purple-500/50 rounded-xl px-6 py-3 font-game text-xl text-purple-300 tracking-widest">
                  WELCOME20
                </div>
                <button
                  onClick={() => onNavigate("catalog")}
                  className="btn-gradient-pink text-white font-game px-8 py-3 rounded-xl glow-pink"
                >
                  Использовать →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
