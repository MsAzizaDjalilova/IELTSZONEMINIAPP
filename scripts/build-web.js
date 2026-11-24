// Vercel uchun: Mini App (/) va Admin Panel (/admin) ni bitta papkaga yig'adi → web-dist/
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const out = path.join(root, 'web-dist');
const run = (cmd) => execSync(cmd, { cwd: root, stdio: 'inherit' });

if (!process.env.VITE_API_URL) {
  console.warn('⚠️  VITE_API_URL berilmagan — frontend API ni o‘z domenidan qidiradi.');
}

run('npm run build --prefix miniapp');
run('npm run build --prefix admin');

fs.rmSync(out, { recursive: true, force: true });
fs.cpSync(path.join(root, 'miniapp', 'dist'), out, { recursive: true });
fs.cpSync(path.join(root, 'admin', 'dist'), path.join(out, 'admin'), { recursive: true });
console.log('✅ web-dist tayyor');
