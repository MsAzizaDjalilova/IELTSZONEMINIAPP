const Course = require('../models/Course');
const Lead = require('../models/Lead');
const { adminToken, checkAdminPassword } = require('../middlewares/auth.middleware');

function login(req, res) {
  const { password } = req.body || {};
  if (!checkAdminPassword(password)) {
    return res.status(401).json({ error: 'Parol noto‘g‘ri' });
  }
  return res.json({ token: adminToken() });
}

/* ---------- So'rovlar (Leads) ---------- */

async function listLeads(req, res) {
  const leads = await Lead.list({ status: req.query.status, q: req.query.q });
  res.json(leads);
}

async function leadStats(req, res) {
  res.json(await Lead.stats());
}

async function updateLead(req, res) {
  const lead = await Lead.update(req.params.id, req.body || {});
  res.json(lead);
}

async function deleteLead(req, res) {
  await Lead.remove(req.params.id);
  res.json({ ok: true });
}

/* ---------- Kurslar (CRUD) ---------- */

async function listCourses(req, res) {
  res.json(await Course.list());
}

async function createCourse(req, res) {
  res.status(201).json(await Course.create(req.body || {}));
}

async function updateCourse(req, res) {
  res.json(await Course.update(req.params.id, req.body || {}));
}

async function deleteCourse(req, res) {
  await Course.remove(req.params.id);
  res.json({ ok: true });
}

module.exports = {
  login,
  listLeads,
  leadStats,
  updateLead,
  deleteLead,
  listCourses,
  createCourse,
  updateCourse,
  deleteCourse,
};
