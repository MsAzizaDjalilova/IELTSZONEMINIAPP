// Vercel'da: VITE_API_URL=https://<render-servis>.onrender.com (lokalda bo'sh qoladi)
const API = (import.meta.env.VITE_API_URL || '').trim().replace(/\/+$/, '');

const TOKEN_KEY = 'iz_admin_token';

export const auth = {
  get: () => {
    try {
      return localStorage.getItem(TOKEN_KEY) || '';
    } catch {
      return '';
    }
  },
  set: (t) => {
    try {
      localStorage.setItem(TOKEN_KEY, t);
    } catch {
      /* empty */
    }
  },
  clear: () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* empty */
    }
  },
};

let onUnauthorized = () => {};
export function setUnauthorizedHandler(fn) {
  onUnauthorized = fn;
}

async function request(path, options = {}) {
  const res = await fetch(`${API}/api/admin${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${auth.get()}`,
      'ngrok-skip-browser-warning': '1',
    },
  });
  let data = null;
  try {
    data = await res.json();
  } catch {
    /* empty */
  }
  if (res.status === 401 && path !== '/login') {
    auth.clear();
    onUnauthorized();
  }
  if (!res.ok) throw new Error(data?.error || `Xatolik (${res.status})`);
  return data;
}

export const api = {
  login: (password) => request('/login', { method: 'POST', body: JSON.stringify({ password }) }),
  stats: () => request('/stats'),
  leads: (params = {}) => {
    const q = new URLSearchParams(Object.entries(params).filter(([, v]) => v)).toString();
    return request(`/leads${q ? `?${q}` : ''}`);
  },
  updateLead: (id, body) => request(`/leads/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteLead: (id) => request(`/leads/${id}`, { method: 'DELETE' }),
  courses: () => request('/courses'),
  createCourse: (body) => request('/courses', { method: 'POST', body: JSON.stringify(body) }),
  updateCourse: (id, body) => request(`/courses/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteCourse: (id) => request(`/courses/${id}`, { method: 'DELETE' }),
};

export const BRANCHES = [
  { id: 'integro', name: 'Integro' },
  { id: 'amir-temur', name: 'Amir Temur' },
  { id: 'drujba', name: 'Drujba' },
  { id: 'online', name: 'Online' },
];

export const CATEGORIES = [
  { id: 'IELTS', name: 'IELTS' },
  { id: 'GENERAL', name: 'General English' },
  { id: 'CEFR', name: 'CEFR' },
  { id: 'SAT', name: 'SAT' },
  { id: 'KIDS', name: 'Kids' },
  { id: 'TOEFL', name: 'TOEFL' },
];

export const STATUSES = [
  { id: 'NEW', name: 'Yangi' },
  { id: 'CONTACTED', name: 'Bog‘lanildi' },
  { id: 'ENROLLED', name: 'Yozildi' },
  { id: 'CANCELLED', name: 'Bekor qilindi' },
];

export const branchName = (id) => BRANCHES.find((b) => b.id === id)?.name || id || '—';
export const money = (n) => (n || n === 0 ? `${Number(n).toLocaleString('ru-RU').replace(/ /g, ' ')} so‘m` : '—');
export function fmtDate(d) {
  const x = new Date(d);
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(x.getDate())}.${pad(x.getMonth() + 1)}.${x.getFullYear()} ${pad(x.getHours())}:${pad(x.getMinutes())}`;
}
