import React, { useEffect, useState } from 'react';
import { api, BRANCHES, CATEGORIES } from '../api.js';

const LANGS = [
  ['uz', 'O‘zbekcha'],
  ['ru', 'Русский'],
  ['en', 'English'],
];

const emptyI18n = () => ({ uz: '', ru: '', en: '' });

function toForm(c) {
  if (!c) {
    return {
      title: emptyI18n(),
      outcome: emptyI18n(),
      description: emptyI18n(),
      duration: emptyI18n(),
      features: emptyI18n(),
      category: 'IELTS',
      imageUrl: '',
      oldPrice: '',
      newPrice: '',
      seatsLeft: '',
      nextStart: '',
      formats: ['integro', 'amir-temur', 'drujba'],
      featured: false,
      isActive: true,
      sortOrder: 0,
    };
  }
  const feat = {};
  for (const [l] of LANGS) feat[l] = (c.features?.[l] || []).join('\n');
  return {
    title: { ...emptyI18n(), ...c.title },
    outcome: { ...emptyI18n(), ...c.outcome },
    description: { ...emptyI18n(), ...c.description },
    duration: { ...emptyI18n(), ...c.duration },
    features: feat,
    category: c.category,
    imageUrl: c.imageUrl || '',
    oldPrice: c.oldPrice ?? '',
    newPrice: c.newPrice ?? '',
    seatsLeft: c.seatsLeft ?? '',
    nextStart: c.nextStart ? c.nextStart.slice(0, 10) : '',
    formats: c.formats || [],
    featured: c.featured,
    isActive: c.isActive,
    sortOrder: c.sortOrder ?? 0,
  };
}

export default function CourseForm({ course, onClose, onSaved }) {
  const [form, setForm] = useState(() => toForm(course));
  const [lang, setLang] = useState('uz');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const setI18n = (key, value) => setForm((f) => ({ ...f, [key]: { ...f[key], [lang]: value } }));
  const toggleFormat = (id) => set('formats', form.formats.includes(id) ? form.formats.filter((x) => x !== id) : [...form.formats, id]);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title.uz.trim()) {
      setLang('uz');
      setError('Kursning o‘zbekcha nomini kiriting');
      return;
    }
    setSaving(true);
    try {
      const body = { ...form, nextStart: form.nextStart || null };
      if (course) await api.updateCourse(course.id, body);
      else await api.createCourse(body);
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="modal" onSubmit={submit}>
        <div className="modal-head">
          <h2>{course ? 'Kursni tahrirlash' : 'Yangi kurs'}</h2>
          <button type="button" className="icon-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="grid2">
            <label className="field">
              <span>Kategoriya</span>
              <select value={form.category} onChange={(e) => set('category', e.target.value)}>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Tartib raqami (kichik — yuqorida)</span>
              <input type="number" value={form.sortOrder} onChange={(e) => set('sortOrder', e.target.value)} />
            </label>
          </div>

          <div className="lang-tabs">
            {LANGS.map(([l, name]) => (
              <button type="button" key={l} className={lang === l ? 'active' : ''} onClick={() => setLang(l)}>
                {name}
                {form.title[l] ? '' : ' •'}
              </button>
            ))}
          </div>

          <label className="field">
            <span>Nomi ({lang.toUpperCase()}){lang === 'uz' ? ' *' : ''}</span>
            <input value={form.title[lang]} onChange={(e) => setI18n('title', e.target.value)} placeholder="Masalan, IELTS Standard" />
          </label>
          <label className="field">
            <span>Natija (qisqa)</span>
            <input value={form.outcome[lang]} onChange={(e) => setI18n('outcome', e.target.value)} placeholder="Masalan, Band 6.0–7.5 uchun tayyorgarlik" />
          </label>
          <label className="field">
            <span>Ta’rif</span>
            <textarea rows={3} value={form.description[lang]} onChange={(e) => setI18n('description', e.target.value)} />
          </label>
          <label className="field">
            <span>Davomiyligi</span>
            <input value={form.duration[lang]} onChange={(e) => setI18n('duration', e.target.value)} placeholder="3 oy · haftada 3 kun · 1 soat 45 daqiqa" />
          </label>
          <label className="field">
            <span>Afzalliklar (har biri yangi qatorda)</span>
            <textarea rows={4} value={form.features[lang]} onChange={(e) => setI18n('features', e.target.value)} />
          </label>
          <p className="hint small">Bo‘sh qoldirilgan tillar o‘zbekcha matn bilan to‘ldiriladi.</p>

          <div className="grid3">
            <label className="field">
              <span>Eski narx (so‘m)</span>
              <input inputMode="numeric" value={form.oldPrice} onChange={(e) => set('oldPrice', e.target.value)} placeholder="ixtiyoriy" />
            </label>
            <label className="field">
              <span>Yangi narx (so‘m / oy)</span>
              <input inputMode="numeric" value={form.newPrice} onChange={(e) => set('newPrice', e.target.value)} placeholder="bo‘sh = so‘rov bo‘yicha" />
            </label>
            <label className="field">
              <span>Bo‘sh joylar</span>
              <input inputMode="numeric" value={form.seatsLeft} onChange={(e) => set('seatsLeft', e.target.value)} placeholder="ixtiyoriy" />
            </label>
          </div>

          <div className="grid2">
            <label className="field">
              <span>Yangi guruh boshlanishi</span>
              <input type="date" value={form.nextStart} onChange={(e) => set('nextStart', e.target.value)} />
            </label>
            <label className="field">
              <span>Rasm URL</span>
              <input value={form.imageUrl} onChange={(e) => set('imageUrl', e.target.value)} placeholder="https://…" />
            </label>
          </div>
          {form.imageUrl && /^https?:\/\//.test(form.imageUrl) && <img className="preview" src={form.imageUrl} alt="" />}

          <div className="field">
            <span>Filiallar / format</span>
            <div className="checks">
              {BRANCHES.map((b) => (
                <label key={b.id} className="check">
                  <input type="checkbox" checked={form.formats.includes(b.id)} onChange={() => toggleFormat(b.id)} />
                  {b.name}
                </label>
              ))}
            </div>
          </div>

          <div className="checks">
            <label className="check">
              <input type="checkbox" checked={form.isActive} onChange={(e) => set('isActive', e.target.checked)} />
              Faol (Mini App’da ko‘rinadi)
            </label>
            <label className="check">
              <input type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} />
              ★ Tavsiya etiladi
            </label>
          </div>

          {error && <div className="error">{error}</div>}
        </div>

        <div className="modal-foot">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Bekor qilish
          </button>
          <button className="btn btn-primary" disabled={saving}>
            {saving ? 'Saqlanmoqda…' : 'Saqlash'}
          </button>
        </div>
      </form>
    </div>
  );
}
