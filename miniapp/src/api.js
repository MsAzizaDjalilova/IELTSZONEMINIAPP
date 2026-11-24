import { tg, inTelegram } from './telegram.js';

// Vercel'da: VITE_API_URL=https://<render-servis>.onrender.com (lokalda bo'sh qoladi)
const API = (import.meta.env.VITE_API_URL || '').trim().replace(/\/+$/, '');

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': '1' };
  if (inTelegram && tg.initData) headers['X-Telegram-Init-Data'] = tg.initData;
  const res = await fetch(`${API}/api${path}`, { ...options, headers: { ...headers, ...(options.headers || {}) } });
  let data = null;
  try {
    data = await res.json();
  } catch {
    /* empty */
  }
  if (!res.ok) throw new Error(data?.error || `Xatolik (${res.status})`);
  return data;
}

export const api = {
  config: () => request('/config'),
  courses: () => request('/courses'),
  createLead: (body) => request('/leads', { method: 'POST', body: JSON.stringify(body) }),
  saveCourse: (courseId, language) => request('/save', { method: 'POST', body: JSON.stringify({ courseId, language }) }),
};
