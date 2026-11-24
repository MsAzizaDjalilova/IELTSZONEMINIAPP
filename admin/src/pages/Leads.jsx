import React, { useCallback, useEffect, useRef, useState } from 'react';
import { api, STATUSES, branchName, fmtDate } from '../api.js';

const REFRESH_MS = 5000;

const ANSWER_LABELS = {
  goal: { ielts65: 'IELTS 6.0–6.5', ielts75: 'IELTS 7.0–7.5', ielts8: 'IELTS 8.0+', general: 'General English', cefr: 'CEFR', sat: 'SAT', kids: 'Kids', toefl: 'TOEFL' },
  level: { zero: 'Noldan', mid: 'Intermediate', high: '7.0+ bor', urgent: 'Imtihoni yaqin' },
};

function beep() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    const ctx = new Ctx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    o.frequency.value = 880;
    g.gain.setValueAtTime(0.15, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    o.start();
    o.stop(ctx.currentTime + 0.4);
  } catch {
    /* empty */
  }
}

function ContactCell({ lead }) {
  const c = lead.contact;
  const username = lead.user?.username;
  return (
    <div className="contact">
      {c.startsWith('@') ? (
        <a href={`https://t.me/${c.slice(1)}`} target="_blank" rel="noreferrer">
          {c}
        </a>
      ) : (
        <a href={`tel:${c}`}>{c}</a>
      )}
      {username && !c.startsWith('@') && (
        <a className="hint small" href={`https://t.me/${username}`} target="_blank" rel="noreferrer">
          @{username}
        </a>
      )}
    </div>
  );
}

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState(null);
  const [status, setStatus] = useState('');
  const [q, setQ] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [fresh, setFresh] = useState(() => new Set());
  const [updatedAt, setUpdatedAt] = useState(null);
  const lastMaxId = useRef(null);

  const load = useCallback(async () => {
    try {
      const [list, s] = await Promise.all([api.leads({ status, q }), api.stats()]);
      const maxId = list.reduce((m, l) => Math.max(m, l.id), 0);
      if (lastMaxId.current !== null && maxId > lastMaxId.current) {
        const newIds = list.filter((l) => l.id > lastMaxId.current).map((l) => l.id);
        setFresh((prev) => new Set([...prev, ...newIds]));
        beep();
      }
      if (lastMaxId.current === null || maxId > lastMaxId.current) lastMaxId.current = maxId;
      setLeads(list);
      setStats(s);
      setError('');
      setUpdatedAt(new Date());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [status, q]);

  // Oldingi so'rov tugagach keyingisi boshlanadi (sekin internetda navbat yig'ilmaydi)
  useEffect(() => {
    let alive = true;
    let timer;
    const tick = async () => {
      await load();
      if (alive) timer = setTimeout(tick, REFRESH_MS);
    };
    tick();
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [load]);

  useEffect(() => {
    const n = stats?.byStatus?.NEW || 0;
    document.title = n ? `(${n}) So‘rovlar — IELTS ZONE` : 'So‘rovlar — IELTS ZONE';
  }, [stats]);

  const changeStatus = async (lead, value) => {
    setLeads((ls) => ls.map((l) => (l.id === lead.id ? { ...l, status: value } : l)));
    try {
      await api.updateLead(lead.id, { status: value });
      load();
    } catch (e) {
      alert(e.message);
      load();
    }
  };

  const remove = async (lead) => {
    if (!window.confirm(`#${lead.id} — ${lead.name} so‘rovini o‘chirasizmi? Bu amalni qaytarib bo‘lmaydi.`)) return;
    try {
      await api.deleteLead(lead.id);
      load();
    } catch (e) {
      alert(e.message);
    }
  };

  const by = stats?.byStatus || {};

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>So‘rovlar</h1>
          <p className="hint small">
            Har {REFRESH_MS / 1000} soniyada avtomatik yangilanadi{updatedAt ? ` · ${updatedAt.toLocaleTimeString('ru-RU')}` : ''}
          </p>
        </div>
        <button className="btn btn-ghost" onClick={load}>
          ↻ Yangilash
        </button>
      </div>

      <div className="stats">
        <div className="stat">
          <span>Bugun</span>
          <b>{stats?.today ?? '—'}</b>
        </div>
        <div className="stat accent">
          <span>Yangi</span>
          <b>{by.NEW ?? '—'}</b>
        </div>
        <div className="stat">
          <span>Bog‘lanildi</span>
          <b>{by.CONTACTED ?? '—'}</b>
        </div>
        <div className="stat">
          <span>Yozildi</span>
          <b>{by.ENROLLED ?? '—'}</b>
        </div>
        <div className="stat">
          <span>Jami</span>
          <b>{stats?.total ?? '—'}</b>
        </div>
      </div>

      <div className="toolbar">
        <div className="seg">
          <button className={!status ? 'active' : ''} onClick={() => setStatus('')}>
            Barchasi
          </button>
          {STATUSES.map((s) => (
            <button key={s.id} className={status === s.id ? 'active' : ''} onClick={() => setStatus(s.id)}>
              {s.name}
            </button>
          ))}
        </div>
        <input className="search" placeholder="Qidirish: ism, telefon, kurs…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      {error && <div className="error">{error}</div>}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Sana</th>
              <th>Mijoz</th>
              <th>Aloqa</th>
              <th>Kurs / savol</th>
              <th>Filial</th>
              <th>Holat</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {leads.map((l) => (
              <tr key={l.id} className={fresh.has(l.id) ? 'fresh' : ''} onClick={() => fresh.has(l.id) && setFresh((s) => new Set([...s].filter((x) => x !== l.id)))}>
                <td className="hint">{l.id}</td>
                <td className="nowrap">{fmtDate(l.createdAt)}</td>
                <td>
                  <b>{l.name}</b>
                  <div className="hint small">
                    {l.source === 'telegram' ? 'Telegram' : 'Brauzer'} · {l.language.toUpperCase()}
                  </div>
                </td>
                <td>
                  <ContactCell lead={l} />
                </td>
                <td className="wide">
                  {l.type === 'QUESTION' ? (
                    <>
                      <span className="tag tag-q">Savol</span>
                      <div className="msg">{l.message}</div>
                    </>
                  ) : (
                    <>
                      <b>{l.courseTitle || l.course?.title?.uz || 'Maslahat kerak'}</b>
                      {l.answers && (
                        <div className="hint small">
                          {[ANSWER_LABELS.goal[l.answers.goal], ANSWER_LABELS.level[l.answers.level]].filter(Boolean).join(' · ')}
                        </div>
                      )}
                    </>
                  )}
                </td>
                <td className="nowrap">{l.type === 'QUESTION' ? '—' : branchName(l.branch)}</td>
                <td>
                  <select className={`status status-${l.status}`} value={l.status} onChange={(e) => changeStatus(l, e.target.value)}>
                    {STATUSES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <button className="icon-btn danger" title="O‘chirish" onClick={() => remove(l)}>
                    ✕
                  </button>
                </td>
              </tr>
            ))}
            {!leads.length && !loading && (
              <tr>
                <td colSpan={8} className="empty">
                  Hozircha so‘rovlar yo‘q
                </td>
              </tr>
            )}
            {loading && (
              <tr>
                <td colSpan={8} className="empty">
                  Yuklanmoqda…
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
