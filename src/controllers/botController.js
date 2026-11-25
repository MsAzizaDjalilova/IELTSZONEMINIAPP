const { InlineKeyboard } = require('grammy');
const bot = require('../core/bot');
const config = require('../config/default');
const User = require('../models/User');

const T = {
  uz: {
    welcome: (name) =>
      `Assalomu alaykum, ${name}! 👋\n\n<b>IELTS ZONE</b> — 2015-yildan beri natija beradigan IELTS tizimi.\n\n` +
      `• Asoschi — Bekzod Mirahmedov, O‘zbekistondagi birinchi Overall 9.0\n` +
      `• Jamoada 13 ta IELTS 9.0 ustoz, CELTA sertifikatli instructorlar\n` +
      `• CD Mock imtihonlari, bepul support teacher va Speaking Club\n\n` +
      `30 soniyada o‘zingizga mos kursni toping va <b>birinchi darsga bepul</b> yoziling 👇`,
    open: '🎯 Kursimni topish',
    noUrl: 'Mini App hali ulanmagan. Administrator WEBAPP_URL ni sozlashi kerak.',
    contacts: () =>
      `📞 ${config.center.phoneDisplay}\n✈️ ${config.center.telegram}\n📸 ${config.center.instagram}\n\n` +
      config.center.branches.filter((b) => b.type === 'offline').map((b) => `📍 ${b.name.uz} — ${b.address.uz}`).join('\n'),
    leadOk: (l) =>
      `✅ <b>So‘rovingiz qabul qilindi!</b> (#${l.id})\n\n` +
      `${l.courseTitle ? `Kurs: <b>${esc(l.courseTitle)}</b>\n` : ''}${l.branchName ? `Format: ${esc(l.branchName)}\n` : ''}` +
      `\nAdministratorimiz tez orada siz bilan bog‘lanadi. Birinchi dars — bepul! 🎉`,
    questionOk: (l) => `✅ Savolingiz qabul qilindi (#${l.id}). Administratorimiz tez orada javob beradi.`,
    saved: '📌 Siz saqlagan kurs:',
    perMonth: 'so‘m / oy',
    priceAsk: 'Narxini administratordan so‘rang',
    enroll: '✍️ Bepul darsga yozilish',
    help: 'Mini Appni ochish uchun pastdagi tugmani bosing yoki /contact — aloqa ma’lumotlari.',
  },
  ru: {
    welcome: (name) =>
      `Здравствуйте, ${name}! 👋\n\n<b>IELTS ZONE</b> — система IELTS, которая даёт результат, с 2015 года.\n\n` +
      `• Основатель — Бекзод Мирахмедов, первый Overall 9.0 в Узбекистане\n` +
      `• 13 преподавателей с IELTS 9.0, инструкторы с сертификатом CELTA\n` +
      `• CD Mock экзамены, бесплатный support teacher и Speaking Club\n\n` +
      `Подберите курс за 30 секунд и запишитесь на <b>бесплатный первый урок</b> 👇`,
    open: '🎯 Подобрать курс',
    noUrl: 'Mini App ещё не подключён. Администратор должен указать WEBAPP_URL.',
    contacts: () =>
      `📞 ${config.center.phoneDisplay}\n✈️ ${config.center.telegram}\n📸 ${config.center.instagram}\n\n` +
      config.center.branches.filter((b) => b.type === 'offline').map((b) => `📍 ${b.name.ru} — ${b.address.ru}`).join('\n'),
    leadOk: (l) =>
      `✅ <b>Заявка принята!</b> (#${l.id})\n\n` +
      `${l.courseTitle ? `Курс: <b>${esc(l.courseTitle)}</b>\n` : ''}${l.branchName ? `Формат: ${esc(l.branchName)}\n` : ''}` +
      `\nНаш администратор скоро свяжется с вами. Первый урок — бесплатно! 🎉`,
    questionOk: (l) => `✅ Вопрос принят (#${l.id}). Администратор скоро ответит.`,
    saved: '📌 Сохранённый курс:',
    perMonth: 'сум / мес',
    priceAsk: 'Цену уточните у администратора',
    enroll: '✍️ Записаться бесплатно',
    help: 'Нажмите кнопку ниже, чтобы открыть Mini App, или /contact — контакты.',
  },
  en: {
    welcome: (name) =>
      `Hello, ${name}! 👋\n\n<b>IELTS ZONE</b> — the IELTS system that yields results, since 2015.\n\n` +
      `• Founded by Bekzod Mirahmedov, Uzbekistan’s first Overall 9.0\n` +
      `• 13 IELTS 9.0 teachers and CELTA-certified instructors\n` +
      `• CD Mock exams, free support teacher and Speaking Club\n\n` +
      `Find your course in 30 seconds and book a <b>free first lesson</b> 👇`,
    open: '🎯 Find my course',
    noUrl: 'The Mini App is not connected yet. The admin needs to set WEBAPP_URL.',
    contacts: () =>
      `📞 ${config.center.phoneDisplay}\n✈️ ${config.center.telegram}\n📸 ${config.center.instagram}\n\n` +
      config.center.branches.filter((b) => b.type === 'offline').map((b) => `📍 ${b.name.en} — ${b.address.en}`).join('\n'),
    leadOk: (l) =>
      `✅ <b>Request received!</b> (#${l.id})\n\n` +
      `${l.courseTitle ? `Course: <b>${esc(l.courseTitle)}</b>\n` : ''}${l.branchName ? `Format: ${esc(l.branchName)}\n` : ''}` +
      `\nOur admissions team will contact you shortly. Your first lesson is free! 🎉`,
    questionOk: (l) => `✅ Question received (#${l.id}). Our admissions team will reply soon.`,
    saved: '📌 Your saved course:',
    perMonth: 'UZS / month',
    priceAsk: 'Ask admissions for the price',
    enroll: '✍️ Book a free lesson',
    help: 'Tap the button below to open the Mini App, or /contact for contacts.',
  },
};

function esc(s) {
  return String(s ?? '').replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
}

const t = (lang) => T[lang] || T.uz;
const hasWebApp = () => /^https:\/\//i.test(config.webAppUrl);

function openKeyboard(lang, path = '') {
  if (!hasWebApp()) return undefined;
  return new InlineKeyboard().webApp(t(lang).open, `${config.webAppUrl}/${path}`);
}

/* ---------- Bot handlerlari ---------- */

async function handleStart(ctx) {
  const from = ctx.from;
  let lang = User.pickLanguage(from?.language_code);
  try {
    const user = await User.upsertFromTelegram(from);
    if (user?.language) lang = user.language;
  } catch (e) {
    console.error('User saqlanmadi:', e.message);
  }
  const name = esc(from?.first_name || 'do‘st');
  if (!hasWebApp()) {
    await ctx.reply(`${t(lang).welcome(name)}\n\n⚠️ ${t(lang).noUrl}`, { parse_mode: 'HTML' });
    return;
  }
  await ctx.reply(t(lang).welcome(name), { parse_mode: 'HTML', reply_markup: openKeyboard(lang) });
}

async function handleContact(ctx) {
  const lang = User.pickLanguage(ctx.from?.language_code);
  await ctx.reply(t(lang).contacts(), { reply_markup: openKeyboard(lang), link_preview_options: { is_disabled: true } });
}

async function handleFallback(ctx) {
  const lang = User.pickLanguage(ctx.from?.language_code);
  await ctx.reply(t(lang).help, { reply_markup: openKeyboard(lang) });
}

/* ---------- API'dan chaqiriladigan funksiyalar ---------- */

async function sendLeadConfirmation(telegramId, lang, lead) {
  if (!bot || !telegramId) return;
  const text = lead.type === 'QUESTION' ? t(lang).questionOk(lead) : t(lang).leadOk(lead);
  await bot.api.sendMessage(telegramId, text, { parse_mode: 'HTML' });
}

// Yangi ariza haqida administrator(lar)ga xabar (ADMIN_CHAT_IDS)
async function notifyAdmins(lead, extra = {}) {
  if (!bot || !config.adminChatIds.length) return;
  const isQ = lead.type === 'QUESTION';
  const lines = [
    isQ ? `❓ <b>Yangi savol</b> (#${lead.id})` : `🆕 <b>Yangi ariza</b> (#${lead.id})`,
    '',
    `👤 ${esc(lead.name)}`,
    `📞 ${esc(lead.contact)}`,
  ];
  if (extra.username) lines.push(`💬 @${esc(extra.username)}`);
  if (lead.courseTitle) lines.push(`📚 ${esc(lead.courseTitle)}`);
  if (extra.branchName) lines.push(`📍 ${esc(extra.branchName)}`);
  if (lead.message) lines.push('', `✉️ ${esc(lead.message)}`);
  if (lead.answers && Object.keys(lead.answers).length) {
    lines.push('', `🎯 ${Object.entries(lead.answers).map(([k, v]) => `${esc(k)}: ${esc(v)}`).join(', ')}`);
  }
  lines.push('', `🌐 ${lead.language?.toUpperCase() || 'UZ'} · ${lead.source === 'telegram' ? 'Telegram' : 'Web'}`);
  const kb = config.webAppUrl ? new InlineKeyboard().url('Admin Panel', `${config.webAppUrl}/admin`) : undefined;
  await Promise.all(
    config.adminChatIds.map((id) =>
      bot.api
        .sendMessage(id, lines.join('\n'), { parse_mode: 'HTML', reply_markup: kb, link_preview_options: { is_disabled: true } })
        .catch((e) => console.warn(`Admin ${id} ga xabar ketmadi:`, e.description || e.message))
    )
  );
}

function formatPrice(n, lang) {
  if (!n) return t(lang).priceAsk;
  return `${n.toLocaleString('ru-RU').replace(/ /g, ' ')} ${t(lang).perMonth}`;
}

async function sendSavedCourse(telegramId, lang, course) {
  if (!bot) throw new Error('Bot sozlanmagan');
  const L = (o) => (o && (o[lang] || o.uz)) || '';
  const features = (course.features?.[lang] || course.features?.uz || []).slice(0, 5).map((f) => `• ${esc(f)}`).join('\n');
  const text =
    `${t(lang).saved}\n\n<b>${esc(L(course.title))}</b>\n${esc(L(course.outcome))}\n\n` +
    `💰 ${formatPrice(course.newPrice, lang)}\n🗓 ${esc(L(course.duration))}\n\n${features}`;
  const kb = hasWebApp() ? new InlineKeyboard().webApp(t(lang).enroll, `${config.webAppUrl}/?enroll=${course.id}`) : undefined;
  await bot.api.sendMessage(telegramId, text, { parse_mode: 'HTML', reply_markup: kb });
}

// Menyu tugmasi va buyruqlarni sozlash (har ishga tushganda)
async function setupBotUi() {
  if (!bot) return;
  const cmds = {
    uz: [{ command: 'start', description: 'Boshlash va kurs tanlash' }, { command: 'contact', description: 'Aloqa va filiallar' }],
    ru: [{ command: 'start', description: 'Начать и выбрать курс' }, { command: 'contact', description: 'Контакты и филиалы' }],
    en: [{ command: 'start', description: 'Start and find a course' }, { command: 'contact', description: 'Contacts and branches' }],
  };
  await bot.api.setMyCommands(cmds.uz);
  await bot.api.setMyCommands(cmds.ru, { language_code: 'ru' });
  await bot.api.setMyCommands(cmds.en, { language_code: 'en' });

  if (hasWebApp()) {
    await bot.api.setChatMenuButton({
      menu_button: { type: 'web_app', text: 'IELTS ZONE', web_app: { url: config.webAppUrl } },
    });
    console.log(`✅ Bot menyu tugmasi ulandi: ${config.webAppUrl}`);
  } else {
    await bot.api.setChatMenuButton({ menu_button: { type: 'commands' } });
    console.log('ℹ️  WEBAPP_URL bo‘sh — Mini App faqat brauzerda ochiladi (README: ngrok bo‘limi).');
  }
}

module.exports = {
  handleStart,
  handleContact,
  handleFallback,
  sendLeadConfirmation,
  notifyAdmins,
  sendSavedCourse,
  setupBotUi,
};
