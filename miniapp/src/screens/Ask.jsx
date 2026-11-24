import React, { useState } from 'react';
import { api } from '../api.js';
import { MainButton, BackButton } from '../components/ui.jsx';
import { haptic, tgUser, openLink } from '../telegram.js';

export default function Ask({ t, lang, config, nav, canGoBack, setToast }) {
  const user = tgUser();
  const c = config.center;
  const [name, setName] = useState(() => user?.first_name || '');
  const [contact, setContact] = useState(() => (user?.username ? `@${user.username}` : ''));
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (loading) return;
    const errs = {};
    if (name.trim().length < 2) errs.name = t('errName');
    const d = contact.replace(/\D/g, '');
    if (!(/^@?[a-zA-Z][a-zA-Z0-9_]{4,31}$/.test(contact.trim()) || (d.length >= 9 && d.length <= 15))) errs.contact = t('errContact');
    if (message.trim().length < 3) errs.message = t('errQuestion');
    setErrors(errs);
    if (Object.keys(errs).length) {
      haptic('error');
      return;
    }
    setLoading(true);
    try {
      const res = await api.createLead({ name: name.trim(), contact: contact.trim(), message: message.trim(), type: 'QUESTION', language: lang });
      haptic('success');
      nav.replace('success', { id: res.id, question: true });
    } catch (e) {
      haptic('error');
      setToast(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stack">
      <BackButton onBack={canGoBack ? nav.back : null} />
      <h1 className="page-title">{t('askScreenTitle')}</h1>
      <section className="card form">
        <label className="field">
          <span>{t('question')}</span>
          <textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t('questionPh')}
            maxLength={1000}
            className={errors.message ? 'invalid' : ''}
          />
          {errors.message && <em className="err">{errors.message}</em>}
        </label>
        <label className="field">
          <span>{t('name')}</span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t('namePh')} maxLength={80} className={errors.name ? 'invalid' : ''} />
          {errors.name && <em className="err">{errors.name}</em>}
        </label>
        <label className="field">
          <span>{t('contact')}</span>
          <input
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder={t('contactPh')}
            inputMode="tel"
            maxLength={40}
            className={errors.contact ? 'invalid' : ''}
          />
          {errors.contact && <em className="err">{errors.contact}</em>}
        </label>
      </section>

      <section className="card">
        <p className="hint small">{t('orContact')}</p>
        <div className="row gap8 wrap mt8">
          <a className="btn btn-ghost" href={`tel:${c.phone}`}>
            📞 {c.phoneDisplay}
          </a>
          <button className="btn btn-ghost" onClick={() => openLink(c.telegram)}>
            ✈️ {t('channel')}
          </button>
          <button className="btn btn-ghost" onClick={() => openLink(c.instagram)}>
            📸 Instagram
          </button>
        </div>
      </section>

      <div className="bottom-space" />
      <MainButton text={t('send')} onClick={submit} loading={loading} />
    </div>
  );
}
