import React from 'react';
import CourseCard from '../components/CourseCard.jsx';
import { MainButton } from '../components/ui.jsx';

export default function Saved(props) {
  const { t, courses, saved, nav } = props;
  const list = courses.filter((c) => saved.includes(c.id));

  return (
    <div className="stack">
      {list.length ? (
        list.map((course) => <CourseCard key={course.id} course={course} {...props} />)
      ) : (
        <div className="empty">
          <div className="empty-icon">📌</div>
          <b>{t('savedEmpty')}</b>
          <p className="hint small">{t('savedEmptyText')}</p>
          <button className="btn btn-ghost" onClick={() => nav.tab('courses')}>
            {t('allCourses')} →
          </button>
        </div>
      )}
      <div className="bottom-space" />
      <MainButton text={t('ctaFree')} onClick={() => nav.push('enroll', {})} />
    </div>
  );
}
