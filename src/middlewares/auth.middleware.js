const crypto = require('crypto');
const config = require('../config/default');

/* ---------- Telegram Mini App initData tekshiruvi ---------- */

function verifyInitData(initData, botToken, maxAgeSec) {
  if (!initData || !botToken) return null;
  const params = new URLSearchParams(initData);
  const hash = params.get('hash');
  if (!hash) return null;
  params.delete('hash');

  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([k, v]) => `${k}=${v}`)
    .join('\n');

  const secret = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
  const calculated = crypto.createHmac('sha256', secret).update(dataCheckString).digest('hex');

  const a = Buffer.from(calculated, 'hex');
  const b = Buffer.from(hash, 'hex');
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  const authDate = Number(params.get('auth_date'));
  if (maxAgeSec && authDate && Date.now() / 1000 - authDate > maxAgeSec) return null;

  try {
    return { user: JSON.parse(params.get('user') || 'null'), authDate };
  } catch {
    return null;
  }
}

// initData bo'lsa tekshiradi (noto'g'ri bo'lsa 401). Bo'lmasa — brauzerdan ochilgan deb davom etadi.
function telegramAuth(req, res, next) {
  const initData = req.get('X-Telegram-Init-Data');
  if (!initData) return next();
  const result = verifyInitData(initData, config.botToken, config.initDataMaxAgeSec);
  if (!result || !result.user) {
    return res.status(401).json({ error: 'Telegram ma’lumotlari tasdiqlanmadi. Mini Appni qayta oching.' });
  }
  req.tgUser = result.user;
  return next();
}

function requireTelegram(req, res, next) {
  if (!req.tgUser) return res.status(401).json({ error: 'Bu amal faqat Telegram ichida ishlaydi.' });
  return next();
}

/* ---------- Admin Panel ---------- */

function adminToken() {
  return crypto.createHmac('sha256', String(config.adminSecret)).update(`admin:${config.adminPassword}`).digest('hex');
}

function safeEqual(a, b) {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

function checkAdminPassword(password) {
  return safeEqual(password || '', config.adminPassword);
}

function adminAuth(req, res, next) {
  const header = req.get('Authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token || !safeEqual(token, adminToken())) {
    return res.status(401).json({ error: 'Avtorizatsiya talab qilinadi' });
  }
  return next();
}

/* ---------- Oddiy rate limit (spamdan himoya) ---------- */

function rateLimit({ windowMs, max }) {
  const hits = new Map();
  return (req, res, next) => {
    const key = req.tgUser?.id ? `tg:${req.tgUser.id}` : `ip:${req.ip}`;
    const now = Date.now();
    const arr = (hits.get(key) || []).filter((t) => now - t < windowMs);
    if (arr.length >= max) {
      return res.status(429).json({ error: 'Juda ko‘p urinish. Birozdan so‘ng qayta urinib ko‘ring.' });
    }
    arr.push(now);
    hits.set(key, arr);
    if (hits.size > 5000) hits.clear();
    return next();
  };
}

module.exports = {
  verifyInitData,
  telegramAuth,
  requireTelegram,
  adminToken,
  checkAdminPassword,
  adminAuth,
  rateLimit,
};
