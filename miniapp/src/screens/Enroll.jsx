import React, { useMemo, useState } from 'react';
import { api } from '../api.js';
import { MainButton, BackButton } from '../components/ui.jsx';
import { haptic, tgUser, requestPhone, versionAtLeast } from '../telegram.js';

function validContact(v) {
  const s = v.trim();
  if (/^@?[a-zA-Z][a-zA-Z0-9_]{4,31}$/.test(s)) return true;
  const d = s.replace(/\D/g, '');
  return d.length >= 9 && d.length <= 15;
}

export default function Enroll({ t, lang, config, courses, nav, params, canGoBack, setToast }) {
  const user = tgUser();
  const [name, setName] = useState(() => [user?.first_name, user?.last_name].filter(Boolean).join(' '));
  const [contact, setContact] = useState(() => (user?.username ? `@${user.username}` : ''));
  const [courseId, setCourseId] = useState(params.courseId ? String(params.courseId) : '');
  const [branch, setBranch] = useState(params.branch || '');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const course = courses.find((c) => String(c.id) === courseId);
  const branches = useMemo(() => {
    const all = config.center.branches;
    return course ? all.filter((b) => course.formats.includes(b.id)) : all;
  }, [course, config]);

  const effectiveBranch = branches.some((b) => b.id === branch) ? branch : branches.length === 1 ? branches[0].id : '';

  const sharePhone = async () => {
    const phone = await requestPhone();
    if (phone) {
      setContact(phone);
      setErrors((e) => ({ ...e, contact: null }));
      haptic('success');
    }
  };

  const submit = async () => {
    if (loading) return;
    const errs = {};
    if (name.trim().length < 2) errs.name = t('errName');
    if (!validContact(contact)) errs.contact = t('errContact');
    if (!effectiveBranch) errs.branch = t('errBranch');
    setErrors(errs);
    if (Object.keys(errs).length) {
      haptic('error');
      return;
    }
    setLoading(true);
    try {
      const res = await api.createLead({
        name: name.trim(),
        contact: contact.trim(),
        courseId: course ? course.id : null,
        branch: effectiveBranch,
        answers: params.answers || null,
        language: lang,
        type: 'ENROLL',
      });
      haptic('success');
      nav.replace('success', { id: res.id, courseTitle: course ? t.L(course.title) : null });
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
      <section>
        <h1 className="page-title">{t('enrollTitle')}</h1>
        <p className="hint">{t('enrollText')}</p>
      </section>

      <section className="card form">
        <label className="field">
          <span>{t('name')}</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('namePh')}
            autoComplete="name"
            maxLength={80}
            className={errors.name ? 'invalid' : ''}
          />
          {errors.name && <em className="err">{errors.name}</em>}
        </label>

        <label className="field">
          <span>{t('contact')}</span>
          <input
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder={t('contactPh')}
            inputMode="tel"
            autoComplete="tel"
            maxLength={40}
            className={errors.contact ? 'invalid' : ''}
          />
          {errors.contact && <em className="err">{errors.contact}</em>}
          {versionAtLeast('6.9') && (
            <button type="button" className="link-btn mt8" onClick={sharePhone}>
              📱 {t('sharePhone')}
            </button>
          )}
        </label>

        <div className="field">
          <span>{t('course')}</span>
          <select value={courseId} onChange={(e) => setCourseId(e.target.value)}>
            <option value="">{t('notSure')}</option>
            {courses.map((c) => (
              <option key={c.id} value={String(c.id)}>
                {t.L(c.title)}
              </option>
            ))}
          </select>
          <select
            className={`mt8 ${errors.branch ? 'invalid' : ''}`}
            value={effectiveBranch}
            onChange={(e) => {
              setBranch(e.target.value);
              setErrors((x) => ({ ...x, branch: null }));
            }}
          >
            <option value="" disabled>
              {t('chooseBranch')}
            </option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {t.L(b.name)}
              </option>
            ))}
          </select>
          {errors.branch && <em className="err">{errors.branch}</em>}
        </div>
        <p className="hint small">🔒 {t('privacy')}</p>
      </section>

      <div className="bottom-space" />
      <MainButton text={t('submit')} onClick={submit} loading={loading} />
    </div>
  );
}
