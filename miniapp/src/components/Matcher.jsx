import React, { useEffect, useRef, useState } from 'react';
import { haptic } from '../telegram.js';
import { Price, Urgency } from './ui.jsx';

const GOALS = [
  ['ielts65', '🎯'],
  ['ielts75', '🚀'],
  ['ielts8', '🏆'],
  ['general', '💬'],
  ['cefr', '🇺🇿'],
  ['sat', '🎓'],
  ['kids', '🧸'],
  ['toefl', '🇺🇸'],
];
const LEVELS = [
  ['zero', '🌱'],
  ['mid', '📘'],
  ['high', '⭐'],
  ['urgent', '⚡'],
];
const IELTS_GOALS = ['ielts65', 'ielts75', 'ielts8'];
const OTHER = {
  general: ['general-english', 'GENERAL', 'why_general'],
  cefr: ['cefr', 'CEFR', 'why_other'],
  sat: ['sat', 'SAT', 'why_other'],
  kids: ['kids', 'KIDS', 'why_general'],
  toefl: ['toefl-ibt', 'TOEFL', 'why_other'],
};

export function recommend({ goal, level, format }, courses) {
  let slug;
  let cat;
  let why;
  if (OTHER[goal]) {
    [slug, cat, why] = OTHER[goal];
  } else if (level === 'zero') {
    [slug, cat, why] = ['general-english', 'GENERAL', 'why_zero'];
  } else if (level === 'high') {
    [slug, cat, why] = ['ielts-expert', 'IELTS', 'why_expert'];
  } else if (format === 'online') {
    [slug, cat, why] = ['ielts-online', 'IELTS', 'why_online'];
  } else if (level === 'urgent') {
    [slug, cat, why] = ['ielts-intensive', 'IELTS', 'why_intensive'];
  } else {
    [slug, cat, why] = ['ielts-standard', 'IELTS', 'why_standard'];
  }
  const pool = courses.filter((c) => c.category === cat);
  const course =
    courses.find((c) => c.slug === slug) ||
    pool.find((c) => c.formats.includes(format)) ||
    pool[0] ||
    courses[0] ||
    null;
  return course ? { course, why, branch: course.formats.includes(format) ? format : course.formats[0] || null } : null;
}

const CONFETTI = Array.from({ length: 16 }, (_, i) => {
  const angle = (i / 16) * Math.PI * 2;
  const dist = 90 + (i % 4) * 22;
  return {
    '--x': `${Math.round(Math.cos(angle) * dist)}px`,
    '--y': `${Math.round(Math.sin(angle) * dist * 0.7)}px`,
    '--r': `${i * 47}deg`,
    '--c': ['#e5e62a', '#ffffff', '#7c6cff', '#22c55e'][i % 4],
    '--d': `${(i % 5) * 30}ms`,
  };
});

export default function Matcher({ t, config, courses, match, setMatch, nav }) {
  const [answers, setAnswers] = useState(match?.answers || {});
  const [picked, setPicked] = useState(null);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);

  const needsLevel = !answers.goal || IELTS_GOALS.includes(answers.goal);
  const steps = needsLevel ? ['goal', 'level', 'format'] : ['goal', 'format'];
  const stepIndex = match ? steps.length : Math.max(0, steps.findIndex((s) => !answers[s]));
  const current = steps[stepIndex];
  const branches = config.center.branches;

  const commit = (key, value) => {
    const next = { ...answers, [key]: value };
    if (key === 'goal') {
      delete next.level;
      delete next.format;
    }
    setAnswers(next);
    setPicked(null);
    const nextSteps = IELTS_GOALS.includes(next.goal) ? ['goal', 'level', 'format'] : ['goal', 'format'];
    if (nextSteps.every((s) => next[s])) {
      const r = recommend(next, courses);
      if (r) {
        haptic('success');
        setMatch({ ...r, answers: next });
      }
    }
  };

  const choose = (key, value) => {
    if (picked) return;
    haptic('select');
    setPicked(value);
    timer.current = setTimeout(() => commit(key, value), 280);
  };

  const goBack = () => {
    const prev = steps[stepIndex - 1];
    if (!prev) return;
    haptic('light');
    const next = { ...answers };
    delete next[prev];
    setAnswers(next);
  };

  const restart = () => {
    haptic('light');
    setAnswers({});
    setMatch(null);
  };

  const head = (
    <>
      <span className="quiz-glow" aria-hidden="true">
        <i />
        <i />
      </span>
      <div className="quiz-head">
        <span className="quiz-timer">⏱ 30s</span>
        <span className="quiz-title">{t('matcherTitle')}</span>
      </div>
      <div className="quiz-steps" aria-label={`${t('step')} ${Math.min(stepIndex + 1, steps.length)}/${steps.length}`}>
        {steps.map((s, i) => (
          <span key={s} className={i < stepIndex ? 'done' : i === stepIndex ? 'active' : ''} />
        ))}
      </div>
    </>
  );

  if (match) {
    const c = match.course;
    const branch = branches.find((b) => b.id === match.branch);
    return (
      <section className="quiz is-result">
        {head}
        <div className="quiz-result" key={`r-${c.id}`}>
          <span className="confetti" aria-hidden="true">
            {CONFETTI.map((s, i) => (
              <i key={i} style={s} />
            ))}
          </span>
          <div className="row between">
            <span className="quiz-eyebrow">✨ {t('recommended')}</span>
            <button className="quiz-link" onClick={restart}>
              ↺ {t('restart')}
            </button>
          </div>
          <h2 className="quiz-course">{t.L(c.title)}</h2>
          <p className="quiz-why">{t(match.why)}</p>
          <div className="pills">
            <span className="pill">🗓 {t.L(c.duration)}</span>
            {branch && (
              <span className="pill">
                {branch.id === 'online' ? '💻' : '📍'} {t.L(branch.name)}
              </span>
            )}
          </div>
          <Urgency course={c} t={t} />
          <div className="quiz-foot">
            <Price course={c} t={t} size="lg" />
            <button className="quiz-link" onClick={() => nav.push('course', { id: c.id })}>
              {t('details')} →
            </button>
          </div>
        </div>
      </section>
    );
  }

  const options =
    current === 'goal'
      ? GOALS.map(([g, icon]) => [g, t(`goal_${g}`), icon])
      : current === 'level'
        ? LEVELS.map(([l, icon]) => [l, t(`level_${l}`), icon])
        : branches.map((b) => [b.id, t.L(b.name), b.id === 'online' ? '💻' : '📍']);

  const question = current === 'goal' ? t('q1') : current === 'level' ? t('q2') : t('q3');

  return (
    <section className="quiz">
      {head}
      <div className="quiz-body" key={current}>
        <div className="quiz-q">
          <span className="quiz-num">0{stepIndex + 1}</span>
          <h3>{question}</h3>
        </div>
        <div className={`quiz-options ${current === 'goal' ? 'cols2' : ''}`}>
          {options.map(([value, label, icon], i) => (
            <button
              key={value}
              style={{ '--i': i }}
              className={`qopt ${picked === value ? 'picked' : ''} ${picked && picked !== value ? 'dim' : ''}`}
              onClick={() => choose(current, value)}
            >
              <span className="qopt-icon">{icon}</span>
              <span className="qopt-label">{label}</span>
              <span className="qopt-check">✓</span>
            </button>
          ))}
        </div>
        {stepIndex > 0 && (
          <button className="quiz-link mt12" onClick={goBack}>
            ← {t('back')}
          </button>
        )}
      </div>
    </section>
  );
}
