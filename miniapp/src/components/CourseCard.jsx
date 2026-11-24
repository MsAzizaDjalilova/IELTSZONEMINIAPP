import React from 'react';
import { Price, Urgency, FormatPills, PinIcon } from './ui.jsx';
import { haptic } from '../telegram.js';

export default function CourseCard({ course, t, config, saved, toggleSave, nav }) {
  const isSaved = saved.includes(course.id);
  const open = () => {
    haptic('light');
    nav.push('course', { id: course.id });
  };
  return (
    <article className="card course-card">
      {course.imageUrl && <img className="course-img" src={course.imageUrl} alt="" loading="lazy" onClick={open} />}
      <div className="course-head" onClick={open}>
        <div>
          <span className={`cat cat-${course.category}`}>{t(`cat_${course.category}`)}</span>
          <h3>{t.L(course.title)}</h3>
          <p className="hint">{t.L(course.outcome)}</p>
        </div>
        <button
          className={`save-btn ${isSaved ? 'on' : ''}`}
          aria-label={isSaved ? t('saved') : t('save')}
          onClick={(e) => {
            e.stopPropagation();
            toggleSave(course);
          }}
        >
          <PinIcon filled={isSaved} />
        </button>
      </div>
      <p className="small muted">{t.L(course.duration)}</p>
      <FormatPills course={course} config={config} t={t} />
      <Urgency course={course} t={t} />
      <div className="course-foot">
        <Price course={course} t={t} />
        <div className="row gap8">
          <button className="btn btn-ghost" onClick={open}>
            {t('details')}
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              haptic('medium');
              nav.push('enroll', { courseId: course.id });
            }}
          >
            {t('enroll')}
          </button>
        </div>
      </div>
    </article>
  );
}
