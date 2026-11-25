require('dotenv').config();

const env = process.env;

// Hosting panellariga nusxalashda qo'shilib qoladigan ortiqcha belgilarni tozalash:
// bo'sh joy/yangi qator, qo'shtirnoq, "DATABASE_URL=" prefiksi, psql '...' o'rami.
function cleanDbUrl(key) {
  let v = env[key];
  if (!v) return;
  const unquote = (s) => s.trim().replace(/^['"]+|['"]+$/g, '').trim();
  v = unquote(v).replace(new RegExp(`^${key}\\s*=\\s*`), '');
  v = unquote(unquote(v).replace(/^psql\s+/, ''));
  // Bir nechta qator yopishtirilgan bo'lsa — faqat birinchi qiymat olinadi
  v = unquote(v.split(/\s+/)[0] || '');
  env[key] = v;
}
for (const k of ['BOT_TOKEN', 'BOT_USERNAME', 'ADMIN_PASSWORD', 'ADMIN_SECRET', 'WEBAPP_URL']) {
  if (env[k]) env[k] = env[k].trim().replace(new RegExp(`^${k}\\s*=\\s*`), '').split(/\r?\n/)[0].trim().replace(/^['"]+|['"]+$/g, '');
}
cleanDbUrl('DATABASE_URL');
cleanDbUrl('DIRECT_URL');
if (env.RENDER) {
  const u = env.DATABASE_URL || '';
  const m = u.match(/^(postgres(?:ql)?):\/\/([^:@/]+):[^@]*@([^/?]+)\/([^?]+)/);
  console.log(
    m
      ? `ℹ️  DATABASE_URL: ${m[1]}://${m[2]}:***@${m[3]}/${m[4]} (uzunligi ${u.length})`
      : `⚠️  DATABASE_URL formati noto‘g‘ri. Boshlanishi: "${u.slice(0, 14)}", uzunligi ${u.length}`
  );
}

const IMG = 'https://zone-storage.fra1.cdn.digitaloceanspaces.com/zone-storage';

module.exports = {
  port: Number(env.PORT) || 3000,
  botToken: (env.BOT_TOKEN || '').trim(),
  botUsername: (env.BOT_USERNAME || '').trim().replace(/^@/, ''),
  webAppUrl: (env.WEBAPP_URL || '').trim().replace(/\/+$/, ''),
  // Backendning ochiq manzili (Render buni RENDER_EXTERNAL_URL sifatida o'zi beradi).
  // Bo'lsa — bot webhook rejimida ishlaydi, bo'lmasa (localhost) — long polling.
  publicUrl: (env.PUBLIC_URL || env.RENDER_EXTERNAL_URL || '').trim().replace(/\/+$/, ''),
  adminPassword: env.ADMIN_PASSWORD || '12345',
  adminSecret: env.ADMIN_SECRET || env.BOT_TOKEN || 'ieltszone-local-secret',
  initDataMaxAgeSec: 7 * 24 * 3600,
  languages: ['uz', 'ru', 'en'],

  // ===== O'quv markaz ma'lumotlari (ieltszone.uz) =====
  center: {
    name: 'IELTS ZONE',
    founded: 2015,
    founder: 'Bekzod Mirahmedov',
    phone: '+998555110909',
    phoneDisplay: '+998 55 511 09 09',
    telegram: 'https://t.me/ieltszone_uz',
    instagram: 'https://instagram.com/ieltszone.uz',
    youtube: 'https://www.youtube.com/@ieltszone',
    website: 'https://ieltszone.uz',
    logoUrl: 'https://ieltszone.uz/images/ielts-zone-logo-no-bg.svg',
    heroImage: 'https://ieltszone.uz/images/website/website-banner.png',
    lessonTimes: ['08:00', '10:00', '14:00', '16:00', '18:00', '19:00'],

    branches: [
      {
        id: 'integro',
        type: 'offline',
        name: { uz: 'Integro filiali', ru: 'Филиал Integro', en: 'Integro branch' },
        address: { uz: 'Toshkent, Bunyodkor ko‘chasi 52', ru: 'Ташкент, ул. Бунёдкор, 52', en: 'Tashkent, 52 Bunyodkor St.' },
        map: 'https://www.google.com/maps/search/?api=1&query=IELTS+ZONE+Bunyodkor+52+Tashkent',
      },
      {
        id: 'amir-temur',
        type: 'offline',
        name: { uz: 'Amir Temur filiali', ru: 'Филиал Амир Темур', en: 'Amir Temur branch' },
        address: { uz: 'Toshkent, Istiqbol ko‘chasi 8', ru: 'Ташкент, ул. Истикбол, 8', en: 'Tashkent, 8 Istiqbol St.' },
        map: 'https://www.google.com/maps/search/?api=1&query=IELTS+ZONE+Istiqbol+8+Tashkent',
      },
      {
        id: 'drujba',
        type: 'offline',
        name: { uz: 'Drujba filiali', ru: 'Филиал Дружба', en: 'Drujba branch' },
        address: { uz: 'Toshkent, Furqat ko‘chasi 15A', ru: 'Ташкент, ул. Фуркат, 15А', en: 'Tashkent, 15A Furqat St.' },
        map: 'https://www.google.com/maps/search/?api=1&query=IELTS+ZONE+Furqat+15A+Tashkent',
      },
      {
        id: 'online',
        type: 'online',
        name: { uz: 'Online (Zoom)', ru: 'Онлайн (Zoom)', en: 'Online (Zoom)' },
        address: { uz: 'Istalgan joydan jonli darslar', ru: 'Живые уроки из любой точки', en: 'Live lessons from anywhere' },
        map: null,
      },
    ],

    teachers: [
      { name: 'Abu Bakr Tolibov', score: '9.0', photo: `${IMG}/666/MW4gVKM9z3ukfcD8gmS38j1zAiovGkxfa7dhi1Qh.jpg` },
      { name: 'Eldorjon Muxtorov', score: '9.0', photo: `${IMG}/665/YYAs30oB8vW1OFYNhe47AkJt9NXYYqHoYo5BGESP.jpg` },
      { name: 'Asilbek Yusupov', score: '9.0', photo: `${IMG}/663/bMHo070w4kjm6lKc3G5cYo6fS8TqHjLf4SNcPD27.jpg` },
      { name: 'Sardorbek Komilov', score: '9.0', photo: `${IMG}/667/bxUV8HXjVAjjZ066Jy1u0WZZt3vcg9k7PnJBR5A6.jpg` },
      { name: 'Adxambek Ismoilov', score: '9.0', photo: `${IMG}/673/OVKk3rW9ECxiqYb97IM8sNnCGDVzDM62ZtWtWrek.jpg` },
      { name: 'Mirjalol Olimboyev', score: '9.0', photo: `${IMG}/672/rdQQJbqB2XFINVoCKRyWcragVhFYl3uIvKkzqtsp.jpg` },
      { name: 'Jurabek Aliboev', score: '9.0', photo: `${IMG}/664/VOi6pCQrEIgDaj6siqIg01UYc1WwX63yLMVyd09w.jpg` },
      { name: 'Gulasal Butayeva', score: '9.0', photo: `${IMG}/671/XjCjoVX4vGzJ3EORTbEendxbaevpmaIwdIAHhInp.jpg` },
      { name: 'Fayoziddin Mamatqulov', score: '9.0', photo: `${IMG}/670/7i52O2skTXb67hHouLPnIZ7F926iwjOaoE8FOkfc.jpg` },
      { name: 'Dovudxon Abdullayev', score: '9.0', photo: `${IMG}/661/I5iflM29xsCznR0MAxfLZttRkEhsQwYJC1RbFDKN.jpg` },
    ],

    // O'quvchilar natijalari: [ism, L, R, W, S, Overall]
    results: [
      ['Islombek Boykobilov', '9.0', '9.0', '8.0', '8.0', '8.5'],
      ['Salomatbek Yusupov', '9.0', '9.0', '8.0', '8.0', '8.5'],
      ['Ziyodulla Normatov', '8.5', '8.5', '8.0', '8.5', '8.5'],
      ['Asliddin Bazarbayev', '9.0', '9.0', '8.0', '7.5', '8.5'],
      ['Parvina Bozorova', '9.0', '9.0', '7.5', '8.0', '8.5'],
      ['Anvar Hasanov', '9.0', '9.0', '7.5', '8.0', '8.5'],
      ['Jasmina Baxtiyorova', '9.0', '8.5', '7.0', '8.0', '8.0'],
      ['Shirin Djumayeva', '8.0', '9.0', '7.5', '7.5', '8.0'],
      ['Dilnoza Roziboyeva', '8.5', '8.5', '7.0', '7.0', '8.0'],
      ['Anel Ahmedova', '8.5', '7.5', '6.5', '8.0', '7.5'],
    ],
  },
};
