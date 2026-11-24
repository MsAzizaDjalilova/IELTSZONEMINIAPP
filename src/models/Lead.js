const prisma = require('../database/connection');
const { notFound, badRequest } = require('../utils/httpError');

const STATUSES = ['NEW', 'CONTACTED', 'ENROLLED', 'CANCELLED'];

const include = {
  user: { select: { telegramId: true, username: true, firstName: true, lastName: true, phone: true } },
  course: { select: { id: true, title: true, category: true } },
};

function create(data) {
  return prisma.lead.create({ data, include });
}

function list({ status, q, take = 300 } = {}) {
  const where = {};
  if (status && STATUSES.includes(status)) where.status = status;
  if (q) {
    const s = String(q).trim();
    where.OR = [
      { name: { contains: s, mode: 'insensitive' } },
      { contact: { contains: s, mode: 'insensitive' } },
      { courseTitle: { contains: s, mode: 'insensitive' } },
      { message: { contains: s, mode: 'insensitive' } },
    ];
  }
  return prisma.lead.findMany({ where, include, orderBy: { createdAt: 'desc' }, take: Math.min(Number(take) || 300, 1000) });
}

async function update(id, { status, adminNote }) {
  const lead = await prisma.lead.findUnique({ where: { id: Number(id) } });
  if (!lead) throw notFound('So‘rov topilmadi');
  const data = {};
  if (status !== undefined) {
    if (!STATUSES.includes(status)) throw badRequest('Holat noto‘g‘ri');
    data.status = status;
  }
  if (adminNote !== undefined) data.adminNote = String(adminNote).slice(0, 1000) || null;
  return prisma.lead.update({ where: { id: Number(id) }, data, include });
}

async function remove(id) {
  const lead = await prisma.lead.findUnique({ where: { id: Number(id) } });
  if (!lead) throw notFound('So‘rov topilmadi');
  return prisma.lead.delete({ where: { id: Number(id) } });
}

async function stats() {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const [total, today, grouped] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { createdAt: { gte: startOfDay } } }),
    prisma.lead.groupBy({ by: ['status'], _count: { _all: true } }),
  ]);
  const byStatus = Object.fromEntries(STATUSES.map((s) => [s, 0]));
  for (const g of grouped) byStatus[g.status] = g._count._all;
  return { total, today, byStatus };
}

module.exports = { STATUSES, create, list, update, remove, stats };
