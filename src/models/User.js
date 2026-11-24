const prisma = require('../database/connection');

function pickLanguage(code) {
  const c = String(code || '').toLowerCase();
  if (c.startsWith('ru')) return 'ru';
  if (c.startsWith('en')) return 'en';
  return 'uz';
}

// Telegram foydalanuvchisini yaratadi yoki yangilaydi
async function upsertFromTelegram(tgUser, extra = {}) {
  if (!tgUser || !tgUser.id) return null;
  const data = {
    firstName: tgUser.first_name || null,
    lastName: tgUser.last_name || null,
    username: tgUser.username || null,
  };
  if (extra.phone) data.phone = extra.phone;
  if (extra.language) data.language = extra.language;

  return prisma.user.upsert({
    where: { telegramId: String(tgUser.id) },
    update: data,
    create: {
      telegramId: String(tgUser.id),
      language: extra.language || pickLanguage(tgUser.language_code),
      ...data,
    },
  });
}

function findByTelegramId(telegramId) {
  return prisma.user.findUnique({ where: { telegramId: String(telegramId) } });
}

module.exports = { pickLanguage, upsertFromTelegram, findByTelegramId };
