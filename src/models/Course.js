const prisma = require('../database/connection');
const config = require('../config/default');
const { badRequest, notFound } = require('../utils/httpError');

const LANGS = config.languages;
const CATEGORIES = ['IELTS', 'GENERAL', 'CEFR', 'SAT', 'KIDS', 'TOEFL'];
const FORMATS = config.center.branches.map((b) => b.id);

function i18nText(value, max = 2000) {
  const out = {};
  for (const l of LANGS) {
    const v = typeof value === 'string' ? value : value?.[l];
    out[l] = String(v ?? '').trim().slice(0, max);
  }
  const fallback = LANGS.map((l) => out[l]).find(Boolean) || '';
  for (const l of LANGS) if (!out[l]) out[l] = fallback;
  return out;
}

function i18nList(value) {
  const out = {};
  for (const l of LANGS) {
    let v = Array.isArray(value) || typeof value === 'string' ? value : value?.[l];
    if (typeof v === 'string') v = v.split('\n');
    out[l] = Array.isArray(v) ? v.map((s) => String(s).trim()).filter(Boolean).slice(0, 20) : [];
  }
  const fallback = LANGS.map((l) => out[l]).find((a) => a.length) || [];
  for (const l of LANGS) if (!out[l].length) out[l] = fallback;
  return out;
}

function intOrNull(v) {
  if (v === '' || v === null || v === undefined) return null;
  const n = Math.round(Number(String(v).replace(/[^\d.-]/g, '')));
  return Number.isFinite(n) ? n : null;
}

function slugify(s) {
  return String(s || 'course')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40) || 'course';
}

// Admin formasidan kelgan ma'lumotni tozalaydi
function toData(input, { partial = false } = {}) {
  const data = {};
  const has = (k) => input[k] !== undefined;

  if (!partial || has('title')) {
    data.title = i18nText(input.title, 120);
    if (!data.title.uz) throw badRequest('Kurs nomini kiriting');
  }
  if (!partial || has('category')) {
    const cat = String(input.category || '').toUpperCase();
    if (!CATEGORIES.includes(cat)) throw badRequest('Kategoriya noto‘g‘ri');
    data.category = cat;
  }
  if (!partial || has('description')) data.description = i18nText(input.description);
  if (!partial || has('outcome')) data.outcome = i18nText(input.outcome, 300);
  if (!partial || has('duration')) data.duration = i18nText(input.duration, 200);
  if (!partial || has('features')) data.features = i18nList(input.features);
  if (!partial || has('imageUrl')) {
    const url = String(input.imageUrl || '').trim();
    if (url && !/^https?:\/\//i.test(url)) throw badRequest('Rasm manzili http(s):// bilan boshlanishi kerak');
    data.imageUrl = url || null;
  }
  if (!partial || has('oldPrice')) data.oldPrice = intOrNull(input.oldPrice);
  if (!partial || has('newPrice')) data.newPrice = intOrNull(input.newPrice);
  if (!partial || has('seatsLeft')) data.seatsLeft = intOrNull(input.seatsLeft);
  if (!partial || has('formats')) {
    const f = Array.isArray(input.formats) ? input.formats : [];
    data.formats = f.filter((x) => FORMATS.includes(x));
    if (!data.formats.length) throw badRequest('Kamida bitta filial yoki formatni tanlang');
  }
  if (!partial || has('nextStart')) {
    const d = input.nextStart ? new Date(input.nextStart) : null;
    data.nextStart = d && !Number.isNaN(d.getTime()) ? d : null;
  }
  if (!partial || has('featured')) data.featured = Boolean(input.featured);
  if (!partial || has('isActive')) data.isActive = input.isActive === undefined ? true : Boolean(input.isActive);
  if (!partial || has('sortOrder')) data.sortOrder = intOrNull(input.sortOrder) ?? 0;
  return data;
}

function list({ activeOnly = false } = {}) {
  return prisma.course.findMany({
    where: activeOnly ? { isActive: true } : undefined,
    orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
  });
}

async function findById(id) {
  const course = await prisma.course.findUnique({ where: { id: Number(id) } });
  if (!course) throw notFound('Kurs topilmadi');
  return course;
}

function count() {
  return prisma.course.count();
}

function create(input) {
  const data = toData(input);
  data.slug = `${slugify(data.title.en || data.title.uz)}-${Date.now().toString(36)}`;
  return prisma.course.create({ data });
}

async function update(id, input) {
  await findById(id);
  return prisma.course.update({ where: { id: Number(id) }, data: toData(input, { partial: true }) });
}

async function remove(id) {
  await findById(id);
  return prisma.course.delete({ where: { id: Number(id) } });
}

module.exports = { CATEGORIES, FORMATS, list, findById, count, create, update, remove };
