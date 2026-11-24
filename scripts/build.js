// `npm run build`:
//  - Render'da (RENDER=true): faqat Prisma client (bazaga ulanmaydi — jadvallar allaqachon bor)
//  - Kompyuterda: Mini App va Admin Panel'ni build qiladi
const path = require('path');
const { execSync } = require('child_process');
const run = (cmd) => execSync(cmd, { cwd: path.join(__dirname, '..'), stdio: 'inherit' });

if (process.env.RENDER) {
  run('npx prisma generate');
} else {
  run('npm run build --prefix miniapp');
  run('npm run build --prefix admin');
}
