import React, { useMemo, useState } from 'react';
import CourseCard from '../components/CourseCard.jsx';
import { MainButton } from '../components/ui.jsx';
import { haptic } from '../telegram.js';
import { useRevealAll } from '../components/anim.jsx';

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

  const rootRef = useRevealAll([cat, fmt, list.length]);

  return (
    <div className="stack" ref={rootRef}>
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

      {list.map((course, i) => (
        <div
          className={`side-wrap reveal ${i % 2 ? 'from-right' : ''}`}
          style={{ '--i': Math.min(i, 3) }}
          key={`${cat}-${fmt}-${course.id}`}
        >
          <CourseCard course={course} {...props} />
        </div>
      ))}
      {!list.length && <p className="hint center">—</p>}

      <div className="bottom-space" />
      <MainButton text={t('ctaFree')} onClick={() => nav.push('enroll', {})} />
    </div>
  );
}
