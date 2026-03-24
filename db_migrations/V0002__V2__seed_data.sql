INSERT INTO packages (name, price, emoji, color, description, popular, is_new, sort_order) VALUES
('Legend Basic', 19, '⚔️', 'from-slate-500 to-gray-600', 'Начальный статус легенды', false, false, 1),
('Legend Gold', 199, '🥇', 'from-yellow-500 to-amber-400', 'Золотой статус для избранных', false, false, 2),
('Legend Platinum', 499, '💠', 'from-cyan-400 to-blue-500', 'Платиновый уровень престижа', true, false, 3),
('Legend Diamond', 999, '💎', 'from-purple-500 to-pink-500', 'Редкий алмазный статус', false, false, 4),
('Временный Админ', 4999, '👑', 'from-red-500 to-orange-500', 'Права администратора на сервере', false, true, 5);

INSERT INTO promo_codes (code, discount_percent, active, usage_limit) VALUES
('WELCOME20', 20, true, 1000),
('SAVE10', 10, true, 500);
