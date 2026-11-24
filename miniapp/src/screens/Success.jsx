import React from 'react';
import { MainButton } from '../components/ui.jsx';
import { inTelegram, tg, openLink } from '../telegram.js';

export default function Success({ t, config, nav, params }) {
  return (
    <div className="stack">
      <section className="success">
        <div className="success-icon">✓</div>
        <h1 className="page-title">{t('successTitle')}</h1>
        {params.id && <span className="pill">#{params.id}</span>}
        {params.courseTitle && <b className="mt8">{params.courseTitle}</b>}
        <p className="hint">{t('successText')}</p>
      </section>

      {!params.question && (
        <section className="card">
          <ol className="steps">
            <li>{t('next1')}</li>
            <li>{t('next2')}</li>
            <li>{t('next3')}</li>
          </ol>
        </section>
      )}

      <div className="row gap8">
        <button className="btn btn-ghost grow" onClick={() => openLink(config.center.telegram)}>
          ✈️ {t('subscribe')}
        </button>
        <button className="btn btn-ghost grow" onClick={() => nav.reset('home')}>
          {t('toHome')}
        </button>
      </div>

      <div className="bottom-space" />
      <MainButton text={inTelegram ? t('close') : t('toHome')} onClick={() => (inTelegram ? tg.close() : nav.reset('home'))} />
    </div>
  );
}
