# IELTS ZONE — Telegram Mini App + Admin Panel

Loyiha 3 qismdan iborat va to'liq kompyuteringizda (localhost) ishlaydi:

| Qism | Manzil |
|---|---|
| Mijozlar uchun Mini App | http://localhost:3000 |
| Admin Panel (parol `.env` faylidagi `ADMIN_PASSWORD`) | http://localhost:3000/admin |
| Telegram bot | https://t.me/ieltszoneminiapp_bot |

---

## 1. Birinchi marta ishga tushirish

PowerShell'ni loyiha papkasida oching (papkada `Shift` + sichqonchaning o'ng tugmasi → **Open PowerShell window here**) va bitta buyruqni yozing:

```powershell
npm run setup
```

Bu buyruq kutubxonalarni o'rnatadi, Neon bazasida jadvallarni yaratadi, kurslarni bazaga yozadi va Mini App hamda Admin Panel'ni build qiladi.

## 2. Har kuni ishga tushirish

```powershell
npm start
```

Terminalda quyidagi yozuvlar chiqishi kerak:

```
✅ Neon PostgreSQL bazasiga ulandi
 Mini App:     http://localhost:3000
 Admin Panel:  http://localhost:3000/admin
🤖 Bot ishlayapti: https://t.me/ieltszoneminiapp_bot
```

To'xtatish uchun: `Ctrl + C`.

> Kodni o'zgartirsangiz, `npm run build` buyrug'ini bering va `npm start` bilan qayta ishga tushiring.

---

## 3. Mini App'ni Telegram'ga ulash (ngrok)

Telegram Mini App faqat **https** manzilda ochiladi. ngrok sizning `localhost:3000` manzilingizga internetdan https orqali kirish yo'lini ochib beradi.

### 3.1. ngrok'ni o'rnatish (bir marta)

1. **https://ngrok.com** saytidan bepul ro'yxatdan o'ting.
2. ngrok'ni o'rnating:
   ```powershell
   winget install ngrok.ngrok
   ```
   (`winget` ishlamasa: https://ngrok.com/download sahifasidan Windows versiyasini yuklab oling va `ngrok.exe` faylini loyiha papkasiga qo'ying.)
3. ngrok saytida **Your Authtoken** sahifasidan tokenni nusxalang va quyidagi buyruqni bering:
   ```powershell
   ngrok config add-authtoken SIZNING_NGROK_TOKENINGIZ
   ```
4. **Doimiy bepul domen oling.** ngrok saytida **Domains** bo'limiga kiring va bepul domenni oling (masalan, `ieltszone-demo.ngrok-free.app`). Shunda manzil har safar o'zgarmaydi.

### 3.2. Har safar ishga tushirish

**1-oyna** (server):
```powershell
npm start
```

**2-oyna** (ngrok), o'zingizning domeningiz bilan:
```powershell
ngrok http --url=ieltszone-demo.ngrok-free.app 3000
```

### 3.3. Manzilni botga ulash (bir marta)

1. `.env` faylini Notepad'da oching va quyidagini yozing:
   ```
   WEBAPP_URL=https://ieltszone-demo.ngrok-free.app
   ```
2. 1-oynada serverni to'xtating (`Ctrl + C`) va qayta ishga tushiring:
   ```powershell
   npm start
   ```
   Terminalda `✅ Bot menyu tugmasi ulandi` yozuvi chiqadi. Bot chatining pastki chap burchagida **IELTS ZONE** tugmasi paydo bo'ladi. `/start` xabaridagi **🎯 Kursimni topish** tugmasi ham Mini App'ni ochadi.

3. *(Ixtiyoriy)* `t.me/ieltszoneminiapp_bot/app` kabi to'g'ridan-to'g'ri havola olish uchun: @BotFather → `/newapp` → botni tanlang → nom, tavsif va rasm kiriting → URL sifatida o'sha `WEBAPP_URL` ni bering.

> **Muhim:** bepul ngrok birinchi ochilishda "You are about to visit…" sahifasini ko'rsatadi. **Visit Site** tugmasini bir marta bossangiz kifoya.
>
> Kompyuteringiz o'chsa yoki ngrok to'xtasa, Mini App ham ochilmaydi. Doimiy ishlashi uchun keyinchalik serverga joylash (deploy) kerak bo'ladi.

---

## 4. Admin Panel

- **So'rovlar:** Mini App'dan kelgan barcha yozilishlar va savollar. Ro'yxat har 5 soniyada avtomatik yangilanadi. Yangi so'rov kelganda signal chalinadi va qator sariq rangda yonib-o'chadi. Holatni (Yangi → Bog'lanildi → Yozildi) shu yerda o'zgartirasiz.
- **Kurslar:** kurs qo'shish, tahrirlash (3 tilda), o'chirish, yashirish ("Faol" tugmasi). Narxni bo'sh qoldirsangiz, Mini App'da "Narxini so'rang" deb chiqadi.
- **"Bo'sh joylar"** va **"Yangi guruh boshlanishi"** maydonlari Mini App'da 🔥 *"Guruhda N ta joy qoldi"* va 🗓 *"Yangi guruh: sana"* yozuvlari sifatida ko'rinadi. Ularga faqat haqiqiy ma'lumot kiriting.

## 5. Markaz ma'lumotlarini o'zgartirish

Filiallar, telefon, ustozlar, o'quvchilar natijalari va dars vaqtlari `src/config/default.js` faylida turadi. O'zgartirgandan keyin `npm start` ni qayta ishga tushiring.

## 6. Muammolar

| Muammo | Yechim |
|---|---|
| `@prisma/client did not initialize yet` | `npx prisma generate`, keyin `npm start` |
| `Bot ishga tushmadi` / `409 Conflict` | Bot boshqa oynada ham ishlayapti — ortiqcha `npm start` oynalarini yoping |
| Mini App Telegram'da oq ekran | ngrok ishlayaptimi va `WEBAPP_URL` to'g'rimi, tekshiring |
| `Mini App hali build qilinmagan` | `npm run build` |
| Sahifa sekin yuklanadi | Neon bazangiz AQShda (us-east-2). Tezroq ishlashi uchun Neon'da **Frankfurt** regionida yangi loyiha oching va `.env` dagi manzillarni almashtiring |

## 7. Papka tuzilishi

```
├── src/
│   ├── config/default.js          # Sozlamalar + markaz ma'lumotlari
│   ├── core/bot.js                # Bot instansiyasi (grammY)
│   ├── database/connection.js     # Prisma ulanishi
│   ├── models/                    # User.js, Course.js, Lead.js
│   ├── controllers/               # botController, clientController, adminController
│   ├── routes/                    # bot.routes, client.routes, admin.routes
│   ├── middlewares/auth.middleware.js  # Telegram initData + admin token tekshiruvi
│   ├── utils/httpError.js
│   └── index.js                   # Server + bot ishga tushadi
├── prisma/schema.prisma, seed.js  # Jadvallar va boshlang'ich kurslar
├── miniapp/                       # React Mini App (uz / ru / en)
├── admin/                         # React Admin Panel
├── .env                           # Maxfiy sozlamalar (GitHub'ga yuklanmaydi)
└── .gitignore
```
