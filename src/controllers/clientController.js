const config = require('../config/default');
const Course = require('../models/Course');
const Lead = require('../models/Lead');
const User = require('../models/User');
const botController = require('./botController');
const { badRequest } = require('../utils/httpError');

const LANGS = config.languages;

function getConfig(req, res) {
  res.json({
    center: config.center,
    botUsername: config.botUsername,
  });
}

async function getCourses(req, res) {
  const courses = await Course.list({ activeOnly: true });
  res.json(courses);
}

function cleanText(v, max) {
  return String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, max);
}

function normalizeContact(raw) {
  const v = cleanText(raw, 64);
  const digits = v.replace(/\D/g, '');
  if (/^@?[a-zA-Z][a-zA-Z0-9_]{4,31}$/.test(v)) return { contact: v.startsWith('@') ? v : `@${v}`, phone: null };
  if (digits.length >= 9 && digits.length <= 15) {
    const phone = digits.length === 9 ? `+998${digits}` : `+${digits}`;
    return { contact: phone, phone };
  }
  return null;
}

async function createLead(req, res) {
  const body = req.body || {};
  const lang = LANGS.includes(body.language) ? body.language : 'uz';
  const type = body.type === 'QUESTION' ? 'QUESTION' : 'ENROLL';

  const name = cleanText(body.name, 80);
  if (name.length < 2) throw badRequest('Ismingizni kiriting');

  const parsed = normalizeContact(body.contact);
  if (!parsed) throw badRequest('Telefon raqam yoki @username noto‘g‘ri');

  const message = body.message ? String(body.message).trim().slice(0, 1000) : null;
  if (type === 'QUESTION' && !message) throw badRequest('Savolingizni yozing');

  let course = null;
  if (body.courseId) {
    course = await Course.findById(body.courseId).catch(() => null);
  }

  const branchDef = config.center.branches.find((b) => b.id === body.branch);
  const branch = branchDef ? branchDef.id : null;

  let answers = null;
  if (body.answers && typeof body.answers === 'object' && !Array.isArray(body.answers)) {
    answers = {};
    for (const [k, v] of Object.entries(body.answers).slice(0, 10)) answers[cleanText(k, 30)] = cleanText(v, 60);
  }

  let user = null;
  if (req.tgUser) {
    user = await User.upsertFromTelegram(req.tgUser, { phone: parsed.phone || undefined }).catch(() => null);
  }

  const lead = await Lead.create({
    userId: user ? user.id : null,
    courseId: course ? course.id : null,
    courseTitle: course ? course.title?.[lang] || course.title?.uz : null,
    name,
    contact: parsed.contact,
    branch,
    type,
    message,
    answers,
    language: lang,
    source: req.tgUser ? 'telegram' : 'web',
  });

  if (req.tgUser) {
    botController
      .sendLeadConfirmation(req.tgUser.id, lang, { ...lead, branchName: branchDef?.name?.[lang] })
      .catch((e) => console.warn('Tasdiq xabari yuborilmadi:', e.description || e.message));
  }

  res.status(201).json({ ok: true, id: lead.id });
}

async function saveCourse(req, res) {
  const body = req.body || {};
  const lang = LANGS.includes(body.language) ? body.language : 'uz';
  const course = await Course.findById(body.courseId);
  await User.upsertFromTelegram(req.tgUser).catch(() => null);
  try {
    await botController.sendSavedCourse(req.tgUser.id, lang, course);
  } catch (e) {
    console.warn('Saqlangan kurs yuborilmadi:', e.description || e.message);
    return res.status(409).json({ error: 'Botga xabar yuborib bo‘lmadi. Avval botda /start bosing.' });
  }
  return res.json({ ok: true });
}

module.exports = { getConfig, getCourses, createLead, saveCourse };
