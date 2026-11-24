import React from 'react';
import { MainButton, BackButton, Price, Urgency, FormatPills, PinIcon } from '../components/ui.jsx';
import { haptic } from '../telegram.js';

export default function CourseDetail({ t, config, courses, saved, toggleSave, nav, params, canGoBack }) {
  const course = courses.find((c) => c.id === params?.id);
  if (!course) {
    return (
      <div className="center-state">
        <BackButton onBack={canGoBack ? nav.back : null} />
        <p>—</p>
      </div>
    );
  }
  const isSaved = saved.includes(course.id);
  const features = course.features?.[t.lang] || course.features?.uz || [];

  return (
    <div className="stack">
      <BackButton onBack={canGoBack ? nav.back : null} />
      {course.imageUrl && <img className="detail-img" src={course.imageUrl} alt="" />}
      <section className="card">
        <span className={`cat cat-${course.category}`}>{t(`cat_${course.category}`)}</span>
        <h1 className="detail-title">{t.L(course.title)}</h1>
        <p className="lead">{t.L(course.outcome)}</p>
        <Price course={course} t={t} size="lg" />
        <Urgency course={course} t={t} />
        <p className="muted mt12">{t.L(course.description)}</p>
      </section>

      {features.length > 0 && (
        <section className="card">
          <h2 className="section-title flush">{t('included')}</h2>
          <ul className="checklist">
            {features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="card">
        <div className="kv">
          <span className="hint small">{t('duration')}</span>
          <b>{t.L(course.duration)}</b>
        </div>
        <div className="kv mt12">
          <span className="hint small">{t('format')}</span>
          <FormatPills course={course} config={config} t={t} />
        </div>
      </section>

      <div className="row gap8">
        <button className={`btn btn-ghost grow ${isSaved ? 'saved' : ''}`} onClick={() => toggleSave(course)}>
          <PinIcon filled={isSaved} /> {isSaved ? t('saved') : t('save')}
        </button>
        <button className="btn btn-ghost grow" onClick={() => nav.push('ask')}>
          💬 {t('askBtn')}
        </button>
      </div>

      <div className="bottom-space" />
      <MainButton
        text={t('ctaEnrollCourse', t.L(course.title))}
        onClick={() => {
          haptic('medium');
          nav.push('enroll', { courseId: course.id });
        }}
      />
    </div>
  );
}
