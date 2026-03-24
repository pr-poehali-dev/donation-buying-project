import { useState } from "react";
import Icon from "@/components/ui/icon";

const faqs = [
  {
    q: "Как быстро зачисляются донаты?",
    a: "Зачисление происходит мгновенно — в течение 1-3 секунд после подтверждения платежа. В редких случаях обработка может занять до 5 минут."
  },
  {
    q: "Какие способы оплаты доступны?",
    a: "Мы принимаем банковские карты Visa/MasterCard/МИР, электронные кошельки (ЮMoney, QIWI), криптовалюту и оплату через СБП."
  },
  {
    q: "Как использовать промокод?",
    a: "Перейди в раздел «Каталог», выбери нужный пакет, прокрути вниз до поля «Промокод» и введи код. Скидка применяется автоматически."
  },
  {
    q: "Что делать если оплата прошла, но донат не зачислился?",
    a: "Напиши нам в чат поддержки с номером транзакции. Мы решим проблему в течение 15 минут."
  },
  {
    q: "Как работает реферальная программа?",
    a: "Поделись своей реферальной ссылкой. Когда друг сделает первую покупку — ты получишь 50 монет, а друг — дополнительные 25 монет."
  },
  {
    q: "Можно ли вернуть деньги?",
    a: "Возврат возможен в течение 24 часов с момента покупки, если донат не был активирован. Обратись в поддержку с номером транзакции."
  },
  {
    q: "Безопасно ли указывать данные карты?",
    a: "Да! Мы не храним данные карт. Все платежи обрабатываются через защищённые платёжные системы с SSL-шифрованием."
  },
];

interface Message {
  id: number;
  text: string;
  sender: "user" | "support";
  time: string;
}

const initMessages: Message[] = [
  { id: 1, text: "Привет! Я Алексей из команды поддержки DonateZone. Чем могу помочь? 😊", sender: "support", time: "14:30" },
];

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>(initMessages);
  const [newMessage, setNewMessage] = useState("");
  const [tab, setTab] = useState<"chat" | "faq">("faq");

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const userMsg: Message = {
      id: messages.length + 1,
      text: newMessage,
      sender: "user",
      time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages(prev => [...prev, userMsg]);
    setNewMessage("");

    setTimeout(() => {
      const autoReplies = [
        "Понял! Проверяю информацию по вашему вопросу...",
        "Спасибо за обращение! Уточните номер вашей транзакции, пожалуйста.",
        "Конечно, помогу! Обычно это занимает пару минут.",
        "Сейчас разберёмся! ⚡",
      ];
      const reply: Message = {
        id: messages.length + 2,
        text: autoReplies[Math.floor(Math.random() * autoReplies.length)],
        sender: "support",
        time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages(prev => [...prev, reply]);
    }, 1200);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <h1 className="font-game text-4xl mb-2">
            ПОДДЕРЖКА <span className="gradient-text">& FAQ</span>
          </h1>
          <p className="text-gray-400">Мы здесь 24/7, чтобы помочь</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {[
            { icon: "⚡", label: "Среднее время ответа", value: "< 3 мин" },
            { icon: "✅", label: "Решено обращений", value: "99.2%" },
            { icon: "🕐", label: "Режим работы", value: "24/7" },
          ].map((s, i) => (
            <div key={i} className="card-glow rounded-2xl p-4 flex items-center gap-4">
              <div className="text-3xl">{s.icon}</div>
              <div>
                <div className="font-game text-white text-lg">{s.value}</div>
                <div className="text-gray-500 text-xs">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab("faq")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
              tab === "faq" ? "btn-gradient text-white" : "card-glow text-gray-400 hover:text-white"
            }`}
          >
            <Icon name="HelpCircle" size={16} />
            Частые вопросы
          </button>
          <button
            onClick={() => setTab("chat")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
              tab === "chat" ? "btn-gradient text-white" : "card-glow text-gray-400 hover:text-white"
            }`}
          >
            <Icon name="MessageCircle" size={16} />
            Живой чат
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          </button>
        </div>

        {tab === "faq" && (
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="card-glow rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-white/2 transition-colors"
                >
                  <span className="font-medium text-white pr-4">{faq.q}</span>
                  <Icon
                    name="ChevronDown"
                    size={18}
                    className={`text-purple-400 flex-shrink-0 transition-transform duration-200 ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-gray-400 leading-relaxed border-t border-white/5 pt-4 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {tab === "chat" && (
          <div className="card-glow rounded-2xl overflow-hidden">
            <div className="flex items-center gap-3 p-4 border-b border-white/5">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl">
                  🎧
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-[#0a0b14]" />
              </div>
              <div>
                <div className="font-game text-white">Алексей — Поддержка</div>
                <div className="text-green-400 text-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                  Онлайн
                </div>
              </div>
            </div>

            <div className="h-80 overflow-y-auto p-4 space-y-4 scrollbar-thin">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
                >
                  <div
                    className={`max-w-xs rounded-2xl px-4 py-3 ${
                      msg.sender === "user"
                        ? "btn-gradient text-white rounded-br-sm"
                        : "bg-white/5 border border-white/10 text-gray-300 rounded-bl-sm"
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.sender === "user" ? "text-purple-200" : "text-gray-600"}`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-white/5">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendMessage()}
                  placeholder="Напиши сообщение..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors text-sm"
                />
                <button
                  onClick={sendMessage}
                  className="btn-gradient text-white px-4 py-3 rounded-xl relative overflow-hidden"
                >
                  <span className="relative z-10">
                    <Icon name="Send" size={18} />
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
