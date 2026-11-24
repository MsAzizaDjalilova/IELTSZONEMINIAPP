// `npm run build`:
//  - Render'da (RENDER=true): faqat backend — Prisma client + baza sxemasi
//  - Kompyuterda: Mini App va Admin Panel'ni build qiladi
const { execSync } = require('child_process');
const run = (cmd) => execSync(cmd, { cwd: require('path').join(__dirname, '..'), stdio: 'inherit' });

if (process.env.RENDER) {
  run('npx prisma generate');
  run('npx prisma db push --skip-generate');
} else {
  run('npm run build --prefix miniapp');
  run('npm run build --prefix admin');
}
