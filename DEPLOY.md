# Deploy: Vercel (frontend) + Render (backend)

- **Vercel** → Mini App (`/`) va Admin Panel (`/admin`)
- **Render** → API + Telegram bot (webhook rejimida)
- **Neon** → baza (o‘zgarmaydi)

Kerakli akkauntlar (hammasi bepul): GitHub, Render (GitHub bilan kiring), Vercel (GitHub bilan kiring).

---

## 1-qadam. Kodni GitHub’ga yuklash

1. https://github.com/new → nom: `ieltszone-miniapp` → **Private** → *Create repository* (README qo‘shmang).
2. Loyiha papkasida terminal oching va quyidagilarni ishga tushiring (`SIZNING_LOGIN` o‘rniga GitHub loginingiz):

```powershell
git remote add origin https://github.com/SIZNING_LOGIN/ieltszone-miniapp.git
```

```powershell
git push -u origin main
```

Brauzer ochilib GitHub’ga kirishni so‘raydi — ruxsat bering.

> `.env` fayl GitHub’ga **yuklanmaydi** (parollar xavfsiz). Ular Render’ga qo‘lda kiritiladi.

---

## 2-qadam. Backend — Render

1. https://dashboard.render.com → **New +** → **Blueprint**.
2. `ieltszone-miniapp` reponi tanlang → Render `render.yaml` ni o‘zi topadi.
3. So‘ralgan qiymatlarni kiriting (`.env` faylingizdan nusxalang):

| Kalit | Qiymat |
|---|---|
| `DATABASE_URL` | `.env` dagi DATABASE_URL |
| `DIRECT_URL` | `.env` dagi DIRECT_URL |
| `BOT_TOKEN` | `.env` dagi BOT_TOKEN |
| `WEBAPP_URL` | hozircha bo‘sh qoldiring (4-qadamda to‘ldiriladi) |
| `ADMIN_PASSWORD` | **yangi kuchli parol** (12345 emas!) |

4. **Apply** → 3–5 daqiqa kuting.
5. Manzil chiqadi, masalan: `https://ieltszone-api.onrender.com`.
   Tekshirish: `https://ieltszone-api.onrender.com/api/health` → `{"ok":true}` chiqishi kerak.

---

## 3-qadam. Frontend — Vercel

1. https://vercel.com/new → `ieltszone-miniapp` reponi **Import**.
2. Sozlamalar:
   - **Framework Preset:** `Other`
   - **Root Directory:** o‘zgartirmang (`./`)
   - Build/Output — o‘zgartirmang (`vercel.json` da bor)
3. **Environment Variables** ga qo‘shing:
   - `VITE_API_URL` = Render manzilingiz (masalan `https://ieltszone-api.onrender.com`, oxirida `/` siz)
4. **Deploy** → manzil chiqadi, masalan: `https://ieltszone-miniapp.vercel.app`.

---

## 4-qadam. Botni Mini App’ga ulash

1. Render → servisingiz → **Environment** → `WEBAPP_URL` = Vercel manzilingiz → **Save Changes**.
2. Render o‘zi qayta ishga tushadi. Logda shular chiqadi:
   - `✅ Bot menyu tugmasi ulandi: https://...vercel.app`
   - `🤖 Bot webhook rejimida`
3. Telegram’da botni oching → `/start` → pastdagi **IELTS ZONE** tugmasi Mini App’ni ochadi. ✅

**Admin Panel:** `https://SIZNING-PROYEKT.vercel.app/admin` (Render’ga yozgan parolingiz bilan).

---

## Muhim eslatmalar

- **Render bepul tarifi 15 daqiqa ishlatilmasa “uxlaydi”.** Keyingi birinchi so‘rov ~30–50 soniya kutadi.
  Uxlamasligi uchun: https://cron-job.org da bepul vazifa yarating → URL: `https://ieltszone-api.onrender.com/api/health`, har **10 daqiqada**.
- **Lokal (`npm start`) va Render bir vaqtda bitta bot tokeni bilan ishlamaydi.** Kompyuterda `npm start` qilsangiz, bot lokalga o‘tib qoladi. Keyin Render’da: **Manual Deploy → Restart service** bosing — bot yana serverga qaytadi.
- **Kodni yangilash:** o‘zgartirib `git push` qilsangiz, Vercel ham, Render ham o‘zi qayta deploy qiladi.

```powershell
git add -A; git commit -m "yangilanish"; git push
```

## Muammo bo‘lsa

| Belgi | Yechim |
|---|---|
| Mini App’da “Xatolik” / kurslar chiqmaydi | Vercel’dagi `VITE_API_URL` to‘g‘rimi? O‘zgartirgandan keyin Vercel’da **Redeploy** qiling |
| Bot javob bermaydi | Render loglarini ko‘ring; `BOT_TOKEN` ni tekshiring; servisni Restart qiling |
| Render build xatosi `P1001` | `DATABASE_URL` noto‘g‘ri yoki Neon bazasi o‘chiq |
| `/admin` ochilmaydi | Vercel manzil oxiriga `/admin` qo‘shing |
