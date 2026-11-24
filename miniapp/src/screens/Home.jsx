import React from 'react';
import Matcher from '../components/Matcher.jsx';
import HeroPortrait from '../components/HeroPortrait.jsx';
import { WhySection, ResultsSection, TeachersSection, ScheduleSection, BranchesSection } from '../components/HomeSections.jsx';
import { useRevealAll } from '../components/anim.jsx';
import { MainButton } from '../components/ui.jsx';
import { haptic, openLink } from '../telegram.js';

export default function Home(props) {
  const { t, lang, config, match, nav } = props;
  const c = config.center;
  const rootRef = useRevealAll([lang]);

  const onMain = () => {
    haptic('medium');
    if (match) nav.push('enroll', { courseId: match.course.id, branch: match.branch, answers: match.answers });
    else nav.push('enroll', {});
  };

  return (
    <div className="stack" ref={rootRef}>
      <section className="hero">
        <span className="hero-particles" aria-hidden="true">
          {Array.from({ length: 7 }).map((_, i) => (
            <i key={i} style={{ '--i': i }} />
          ))}
        </span>
        <div className="hero-text">
          <span className="hero-eyebrow enter" style={{ '--d': 0 }}>
            {t('heroEyebrow')}
          </span>
          <h1 className="enter" style={{ '--d': 1 }}>
            {t('heroTitle')}
          </h1>
          <p className="enter" style={{ '--d': 2 }}>
            {t('heroText')}
          </p>
          <div className="hero-chips">
            {['chip9', 'chipCelta', 'chipMock'].map((k, i) => (
              <span className="enter pop-in" style={{ '--d': 3 + i * 0.5 }} key={k}>
                {t(k)}
              </span>
            ))}
          </div>
        </div>
        {c.heroImage && <HeroPortrait src={c.heroImage} alt={c.founder} label={t('founderBadge')} />}
      </section>

      <Matcher {...props} />

      <button className="card free-strip reveal" onClick={onMain}>
        <span className="free-icon">🎁</span>
        <span>
          <b>{t('freeLesson')}</b>
          <span className="hint small block">{t('freeLessonText')}</span>
        </span>
        <span className="chev">›</span>
      </button>

      <WhySection t={t} />
      <ResultsSection t={t} results={c.results} />
      <TeachersSection t={t} teachers={c.teachers} />
      <ScheduleSection t={t} times={c.lessonTimes} />
      <BranchesSection t={t} branches={c.branches} />

      <section className="card ask-card reveal">
        <h2 className="section-title flush">{t('askTitle')}</h2>
        <p className="hint small">{t('askText')}</p>
        <div className="row gap8 wrap mt12">
          <button className="btn btn-dark" onClick={() => nav.push('ask')}>
            💬 {t('askBtn')}
          </button>
          <a className="btn btn-ghost" href={`tel:${c.phone}`}>
            📞 {c.phoneDisplay}
          </a>
          <button className="btn btn-ghost" onClick={() => openLink(c.telegram)}>
            ✈️ {t('channel')}
          </button>
        </div>
      </section>

      <div className="bottom-space" />
      <MainButton text={match ? t('ctaEnrollCourse', t.L(match.course.title)) : t('ctaFree')} onClick={onMain} />
    </div>
  );
}
