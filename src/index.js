const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const express = require('express');
const cors = require('cors');
const { webhookCallback } = require('grammy');

const config = require('./config/default');
const prisma = require('./database/connection');
const bot = require('./core/bot');
const registerBotRoutes = require('./routes/bot.routes');
const clientRoutes = require('./routes/client.routes');
const adminRoutes = require('./routes/admin.routes');
const { setupBotUi } = require('./controllers/botController');
const { seedCourses } = require('../prisma/seed');

const app = express();
app.set('trust proxy', 1);
app.use(cors());
app.use(express.json({ limit: '200kb' }));

/* ---------- API ---------- */
app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/admin', adminRoutes);
app.use('/api', clientRoutes);
app.use('/api', (req, res) => res.status(404).json({ error: 'Topilmadi' }));

/* ---------- Telegram webhook (faqat serverda: Render) ---------- */
const useWebhook = Boolean(bot && config.publicUrl.startsWith('https://'));
const hookSecret = crypto.createHash('sha256').update(`hook:${config.botToken}`).digest('hex').slice(0, 32);
const hookPath = `/telegram/${hookSecret}`;
if (useWebhook) {
  app.post(hookPath, webhookCallback(bot, 'express', { secretToken: hookSecret }));
}

/* ---------- Admin Panel (/admin) va Mini App (/) ---------- */
const adminDist = path.join(__dirname, '..', 'admin', 'dist');
const miniDist = path.join(__dirname, '..', 'miniapp', 'dist');

function serveSpa(prefix, dir, label) {
  if (!fs.existsSync(path.join(dir, 'index.html'))) {
    // Serverda (Render) frontend yo'q — u Vercel'da. Lokalda esa build kerakligini aytadi.
    app.get(prefix === '/' ? '*' : `${prefix}*`, (req, res) =>
      config.publicUrl
        ? res.json({ ok: true, service: 'IELTS ZONE API', frontend: config.webAppUrl || null })
        : res.status(503).send(`<h3>${label} hali build qilinmagan.</h3><p>Terminalda: <code>npm run build</code></p>`)
    );
    return;
  }
  app.use(prefix, express.static(dir, { index: false, maxAge: '1h' }));
  app.get(prefix === '/' ? '*' : [prefix, `${prefix}/*`], (req, res) => {
    res.set('Cache-Control', 'no-store');
    res.sendFile(path.join(dir, 'index.html'));
  });
}

serveSpa('/admin', adminDist, 'Admin Panel');
serveSpa('/', miniDist, 'Mini App');

/* ---------- Xatolar ---------- */
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.status || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({ error: status >= 500 ? 'Serverda xatolik yuz berdi' : err.message });
});

/* ---------- Ishga tushirish ---------- */
async function start() {
  await prisma.$connect();
  console.log('✅ Neon PostgreSQL bazasiga ulandi');

  const added = await seedCourses(prisma, { onlyIfEmpty: true });
  if (added) console.log(`🌱 Bazaga ${added} ta kurs qo‘shildi`);

  app.listen(config.port, () => {
    console.log('\n==============================================');
    console.log(` Mini App:     http://localhost:${config.port}`);
    console.log(` Admin Panel:  http://localhost:${config.port}/admin`);
    if (config.webAppUrl) console.log(` Telegram:     ${config.webAppUrl}`);
    console.log('==============================================\n');
  });

  if (!bot) {
    console.warn('⚠️  BOT_TOKEN yo‘q — bot ishga tushmadi.');
    return;
  }
  registerBotRoutes(bot);
  try {
    await bot.init();
    await setupBotUi();
    if (useWebhook) {
      await bot.api.setWebhook(`${config.publicUrl}${hookPath}`, {
        secret_token: hookSecret,
        drop_pending_updates: true,
      });
      console.log(`🤖 Bot webhook rejimida: https://t.me/${bot.botInfo.username}`);
    } else {
      bot.start({
        drop_pending_updates: true,
        onStart: (me) => console.log(`🤖 Bot ishlayapti: https://t.me/${me.username}`),
      }).catch((e) => console.error('Bot to‘xtadi:', e.description || e.message));
    }
  } catch (e) {
    console.error('❌ Bot ishga tushmadi (tokenni tekshiring):', e.description || e.message);
  }
}

async function shutdown() {
  console.log('\nTo‘xtatilmoqda...');
  try {
    if (bot && !useWebhook) await bot.stop();
  } catch {
    /* empty */
  }
  await prisma.$disconnect().catch(() => {});
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

start().catch(async (e) => {
  console.error('❌ Server ishga tushmadi:', e.message);
  await prisma.$disconnect().catch(() => {});
  process.exit(1);
});
