import React, { useState } from 'react';
import { inTelegram, useMainButton, useBackButton } from '../telegram.js';

export function Logo({ src }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return <span className="logo-text">IELTS ZONE</span>;
  return <img className="logo" src={src} alt="IELTS ZONE" onError={() => setFailed(true)} />;
}

// Telegram'da — haqiqiy MainButton; brauzerda — pastga yopishgan tugma.
export function MainButton({ text, onClick, loading = false, disabled = false, visible = true }) {
  useMainButton({ text, onClick, loading, disabled, visible });
  if (inTelegram || !visible || !text) return null;
  return (
    <div className="mainbtn-wrap">
      <button className="mainbtn" onClick={onClick} disabled={disabled || loading}>
        {loading ? <span className="spinner sm" /> : text}
      </button>
    </div>
  );
}

export function BackButton({ onBack }) {
  useBackButton(onBack);
  return null;
}

export function Price({ course, t, size = 'md' }) {
  const p = t.price(course.newPrice);
  const old = t.price(course.oldPrice);
  if (!p) return <div className={`price ${size}`}><span className="price-ask">{t('priceAsk')}</span></div>;
  return (
    <div className={`price ${size}`}>
      {old && <s className="price-old">{old}</s>}
      <b>{p}</b> <span className="hint">{t('perMonth')}</span>
    </div>
  );
}

export function Urgency({ course, t }) {
  const items = [];
  if (course.seatsLeft !== null && course.seatsLeft !== undefined && course.seatsLeft > 0 && course.seatsLeft <= 10) {
    items.push(
      <span key="s" className="pill pill-hot">
        🔥 {t('seatsLeft', course.seatsLeft)}
      </span>
    );
  }
  if (course.nextStart && new Date(course.nextStart) > new Date()) {
    items.push(
      <span key="d" className="pill">
        🗓 {t('nextStart', t.date(course.nextStart))}
      </span>
    );
  }
  if (!items.length) return null;
  return <div className="pills">{items}</div>;
}

export function FormatPills({ course, config, t }) {
  const branches = config?.center?.branches || [];
  return (
    <div className="pills">
      {course.formats.map((f) => {
        const b = branches.find((x) => x.id === f);
        return (
          <span key={f} className={`pill ${f === 'online' ? 'pill-online' : ''}`}>
            {f === 'online' ? '💻' : '📍'} {b ? t.L(b.name) : f}
          </span>
        );
      })}
    </div>
  );
}

export function PinIcon({ filled }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}
