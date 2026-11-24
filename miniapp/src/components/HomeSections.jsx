import React, { useEffect, useMemo, useState } from 'react';
import { CountUp, reducedMotion } from './anim.jsx';
import { openLink, haptic } from '../telegram.js';

/* ================= Nega IELTS ZONE ================= */

const WHY = [
  { icon: '🏆', title: 'why1t', text: 'why1', tone: 'gold' },
  { icon: '📝', title: 'why2t', text: 'why2', tone: 'blue' },
  { icon: '🤝', title: 'why3t', text: 'why3', tone: 'green' },
  { icon: '🗣', title: 'why4t', text: 'why4', tone: 'pink' },
];

export function WhySection({ t }) {
  return (
    <section>
      <h2 className="section-title reveal">{t('whyTitle')}</h2>
      <div className="why-grid reveal">
        {WHY.map((w, i) => (
          <div className={`why-tile tone-${w.tone} slidein`} style={{ '--i': i }} key={w.title}>
            <span className="why-blob" aria-hidden="true" />
            <span className="why-shine" aria-hidden="true" />
            <span className="why-num">0{i + 1}</span>
            <span className="why-icon">
              <span>{w.icon}</span>
            </span>
            <b>{t(w.title)}</b>
            <span className="why-text">{t(w.text)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ================= Natijalar ================= */

export function ResultsSection({ t, results }) {
  return (
    <section>
      <div className="section-head reveal">
        <h2 className="section-title flush">{t('resultsTitle')}</h2>
        <span className="hint small">{t('resultsSub')}</span>
      </div>
      <div className="hscroll results-scroll">
        {results.map(([name, l, r, w, s, o], i) => (
          <article className="score-card reveal slide" style={{ '--i': Math.min(i, 4) }} key={name}>
            <div className="score-ring" style={{ '--p': Number(o) / 9 }}>
              <svg viewBox="0 0 64 64" aria-hidden="true">
                <circle className="ring-bg" cx="32" cy="32" r="27" pathLength="100" />
                <circle className="ring-fg" cx="32" cy="32" r="27" pathLength="100" />
              </svg>
              <div className="ring-val">
                <CountUp value={o} />
                <small>Overall</small>
              </div>
            </div>
            <b className="score-name">{name}</b>
            <div className="bands-bars">
              {[
                ['L', l],
                ['R', r],
                ['W', w],
                ['S', s],
              ].map(([k, v]) => (
                <div className="band-row" key={k}>
                  <span>{k}</span>
                  <div className="bar">
                    <i style={{ '--v': Number(v) }} />
                  </div>
                  <em>{v}</em>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ================= Ustozlar (cheksiz lenta) ================= */

export function TeachersSection({ t, teachers }) {
  const [paused, setPaused] = useState(false);
  const still = reducedMotion();
  const list = still ? teachers : [...teachers, ...teachers];
  return (
    <section>
      <div className="section-head reveal">
        <h2 className="section-title flush">{t('teachersTitle')}</h2>
        <span className="hint small">{t('teachersSub')}</span>
      </div>
      <div
        className={`marquee reveal ${still ? 'still' : ''} ${paused ? 'paused' : ''}`}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="marquee-track" style={{ '--n': teachers.length }}>
          {list.map((tc, i) => (
            <figure className="teacher-card" key={`${tc.name}-${i}`} aria-hidden={i >= teachers.length ? 'true' : undefined}>
              <img src={tc.photo} alt={tc.name} loading="lazy" draggable="false" />
              <figcaption>
                <span className="t-score">
                  <b>{tc.score}</b> IELTS
                </span>
                <b className="t-name">{tc.name}</b>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= Guruh vaqtlari ================= */

const DAY_START = 7;
const DAY_END = 21;

function tashkentNow() {
  try {
    const s = new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Tashkent', hour: '2-digit', minute: '2-digit', hour12: false });
    const [h, m] = s.split(':').map(Number);
    return h * 60 + m;
  } catch {
    const d = new Date();
    return d.getHours() * 60 + d.getMinutes();
  }
}

const toMin = (x) => {
  const [h, m] = x.split(':').map(Number);
  return h * 60 + m;
};

export function ScheduleSection({ t, times }) {
  const [now, setNow] = useState(tashkentNow);
  useEffect(() => {
    const id = setInterval(() => setNow(tashkentNow()), 30000);
    return () => clearInterval(id);
  }, []);

  const periods = useMemo(() => {
    const p = [
      { key: 'morning', icon: '🌅', times: [] },
      { key: 'daytime', icon: '☀️', times: [] },
      { key: 'evening', icon: '🌙', times: [] },
    ];
    times.forEach((x) => {
      const h = toMin(x) / 60;
      p[h < 12 ? 0 : h < 17 ? 1 : 2].times.push(x);
    });
    return p.filter((x) => x.times.length);
  }, [times]);

  const pos = (min) => `${Math.max(0, Math.min(100, ((min / 60 - DAY_START) / (DAY_END - DAY_START)) * 100))}%`;
  const next = times.find((x) => toMin(x) > now);
  const nowInRange = now / 60 >= DAY_START && now / 60 <= DAY_END;

  return (
    <section className="schedule reveal">
      <div className="section-head">
        <h2 className="section-title flush">{t('scheduleTitle')}</h2>
        <span className="hint small">{t('scheduleText')}</span>
      </div>

      <div className="daybar">
        <div className="daybar-sky" />
        {times.map((x, i) => (
          <span className="tick" style={{ left: pos(toMin(x)), '--i': i }} key={x}>
            <i />
            <em>{x}</em>
          </span>
        ))}
        {nowInRange && (
          <span className="now" style={{ left: pos(now) }}>
            <i />
            <em>{t('nowLabel')}</em>
          </span>
        )}
      </div>

      <div className="next-chip">
        <span className="pulse-dot" />
        {next ? t('nextToday', next) : t('nextTomorrow', times[0])}
      </div>

      <div className="periods">
        {periods.map((p, i) => (
          <div className={`period period-${p.key} reveal pop`} style={{ '--i': i }} key={p.key}>
            <span className="period-icon">{p.icon}</span>
            <b>{t(p.key)}</b>
            <div className="period-times">
              {p.times.map((x) => (
                <span key={x} className={x === next ? 'is-next' : ''}>
                  {x}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="schedule-foot">
        <span>⏱ {t('lessonLen')}</span>
        <span>📝 {t('mockNote')}</span>
      </div>
    </section>
  );
}

/* ================= Filiallar ================= */

export function BranchesSection({ t, branches }) {
  return (
    <section>
      <div className="section-head reveal">
        <h2 className="section-title flush">{t('branchesTitle')}</h2>
        <span className="hint small">{t('branchesSub')}</span>
      </div>
      <div className="branches">
        {branches.map((b, i) => {
          const online = b.id === 'online';
          return (
            <button
              type="button"
              className={`branch-card reveal slide ${online ? 'is-online' : ''}`}
              style={{ '--i': i }}
              key={b.id}
              onClick={() => {
                if (!b.map) return;
                haptic('light');
                openLink(b.map);
              }}
            >
              <span className={`branch-map ${online ? 'map-online' : ''}`} style={{ '--seed': i }}>
                {online ? (
                  <span className="waves">
                    <i />
                    <i />
                    <i />
                    <b>💻</b>
                  </span>
                ) : (
                  <>
                    <span className="streets" />
                    <span className="pin">
                      <span className="pin-ripple" />
                      <span className="pin-head" />
                    </span>
                  </>
                )}
              </span>
              <span className="branch-info">
                <b>{t.L(b.name)}</b>
                <span className="hint small">{online ? t('zoomLive') : t.L(b.address)}</span>
              </span>
              {b.map && <span className="branch-go">{t('route')} ↗</span>}
            </button>
          );
        })}
      </div>
    </section>
  );
}
