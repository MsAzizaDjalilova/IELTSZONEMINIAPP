import React, { useMemo, useState } from 'react';
import CourseCard from '../components/CourseCard.jsx';
import { MainButton } from '../components/ui.jsx';
import { haptic } from '../telegram.js';

const CATS = ['ALL', 'IELTS', 'GENERAL', 'CEFR', 'SAT', 'KIDS', 'TOEFL'];

export default function Courses(props) {
  const { t, courses, nav } = props;
  const [cat, setCat] = useState('ALL');
  const [fmt, setFmt] = useState('ALL');

  const available = useMemo(() => CATS.filter((c) => c === 'ALL' || courses.some((x) => x.category === c)), [courses]);

  const list = courses.filter((c) => {
    if (cat !== 'ALL' && c.category !== cat) return false;
    if (fmt === 'ONLINE' && !c.formats.includes('online')) return false;
    if (fmt === 'OFFLINE' && !c.formats.some((f) => f !== 'online')) return false;
    return true;
  });

  return (
    <div className="stack">
      <div className="chips-scroll">
        {available.map((c) => (
          <button
            key={c}
            className={`chip ${cat === c ? 'active' : ''}`}
            onClick={() => {
              haptic('select');
              setCat(c);
            }}
          >
            {c === 'ALL' ? t('filterAll') : t(`cat_${c}`)}
          </button>
        ))}
      </div>
      <div className="segmented">
        {[
          ['ALL', t('fmtAll')],
          ['OFFLINE', t('fmtOffline')],
          ['ONLINE', t('fmtOnline')],
        ].map(([v, label]) => (
          <button
            key={v}
            className={fmt === v ? 'active' : ''}
            onClick={() => {
              haptic('select');
              setFmt(v);
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {list.map((course) => (
        <CourseCard key={course.id} course={course} {...props} />
      ))}
      {!list.length && <p className="hint center">—</p>}

      <div className="bottom-space" />
      <MainButton text={t('ctaFree')} onClick={() => nav.push('enroll', {})} />
    </div>
  );
}
