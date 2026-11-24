import React, { useCallback, useEffect, useState } from 'react';
import { api, CATEGORIES, branchName, money } from '../api.js';
import CourseForm from './CourseForm.jsx';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [editing, setEditing] = useState(null); // null | {} (yangi) | course
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setCourses(await api.courses());
      setError('');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (c) => {
    if (!window.confirm(`“${c.title.uz}” kursini o‘chirasizmi? Bu amalni qaytarib bo‘lmaydi.\n\nMaslahat: vaqtincha yashirish uchun “Faol” belgisini olib tashlang.`)) return;
    try {
      await api.deleteCourse(c.id);
      load();
    } catch (e) {
      alert(e.message);
    }
  };

  const toggleActive = async (c) => {
    try {
      await api.updateCourse(c.id, { isActive: !c.isActive });
      load();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Kurslar</h1>
          <p className="hint small">Mini App’da faqat “Faol” kurslar ko‘rinadi</p>
        </div>
        <button className="btn btn-primary" onClick={() => setEditing({})}>
          + Yangi kurs
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Rasm</th>
              <th>Nomi</th>
              <th>Kategoriya</th>
              <th>Narx (oy)</th>
              <th>Joylar</th>
              <th>Filiallar</th>
              <th>Faol</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {courses.map((c) => (
              <tr key={c.id} className={c.isActive ? '' : 'inactive'}>
                <td>{c.imageUrl ? <img className="thumb" src={c.imageUrl} alt="" /> : <div className="thumb thumb-empty">{c.category[0]}</div>}</td>
                <td className="wide">
                  <b>{c.title.uz}</b>
                  {c.featured && <span className="tag tag-star">★ Tavsiya</span>}
                  <div className="hint small">{c.outcome?.uz}</div>
                </td>
                <td>{CATEGORIES.find((x) => x.id === c.category)?.name || c.category}</td>
                <td className="nowrap">
                  {c.oldPrice ? <s className="hint small">{money(c.oldPrice)}</s> : null}
                  <div>{c.newPrice ? money(c.newPrice) : <span className="hint">So‘rov bo‘yicha</span>}</div>
                </td>
                <td>{c.seatsLeft ?? '—'}</td>
                <td className="small">{c.formats.map(branchName).join(', ')}</td>
                <td>
                  <label className="switch">
                    <input type="checkbox" checked={c.isActive} onChange={() => toggleActive(c)} />
                    <span />
                  </label>
                </td>
                <td className="nowrap">
                  <button className="btn btn-ghost sm" onClick={() => setEditing(c)}>
                    Tahrirlash
                  </button>{' '}
                  <button className="icon-btn danger" title="O‘chirish" onClick={() => remove(c)}>
                    ✕
                  </button>
                </td>
              </tr>
            ))}
            {!courses.length && !loading && (
              <tr>
                <td colSpan={8} className="empty">
                  Kurslar yo‘q
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <CourseForm
          course={editing.id ? editing : null}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            load();
          }}
        />
      )}
    </div>
  );
}
