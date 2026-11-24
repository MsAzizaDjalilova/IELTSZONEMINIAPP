import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from './api.js';
import { LANGS, detectLang, makeT } from './i18n.js';
import { inTelegram, tgUser, startParam, haptic } from './telegram.js';
import Home from './screens/Home.jsx';
import Courses from './screens/Courses.jsx';
import Saved from './screens/Saved.jsx';
import CourseDetail from './screens/CourseDetail.jsx';
import Enroll from './screens/Enroll.jsx';
import Ask from './screens/Ask.jsx';
import Success from './screens/Success.jsx';
import { Logo } from './components/ui.jsx';

const LS_LANG = 'iz_lang';
const LS_SAVED = 'iz_saved';

function readLS(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}
function writeLS(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* empty */
  }
}

export default function App() {
  const [lang, setLang] = useState(() => readLS(LS_LANG, null) || detectLang(tgUser()?.language_code || navigator.language));
  const t = useMemo(() => makeT(lang), [lang]);

  const [config, setConfig] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loadError, setLoadError] = useState('');
  const [stack, setStack] = useState([{ name: 'home' }]);
  const [saved, setSaved] = useState(() => readLS(LS_SAVED, []));
  const [match, setMatch] = useState(null);
  const [toast, setToast] = useState('');

  const route = stack[stack.length - 1];

  const load = useCallback(async () => {
    setLoadError('');
    try {
      const [cfg, list] = await Promise.all([api.config(), api.courses()]);
      setConfig(cfg);
      setCourses(list);
      const sp = startParam();
      const m = sp && /^enroll_(\d+)$/.exec(sp);
      if (m && list.some((c) => c.id === Number(m[1]))) {
        setStack([{ name: 'home' }, { name: 'enroll', params: { courseId: Number(m[1]) } }]);
      }
    } catch (e) {
      setLoadError(e.message);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    document.documentElement.lang = lang;
    writeLS(LS_LANG, lang);
  }, [lang]);

  useEffect(() => writeLS(LS_SAVED, saved), [saved]);

  useEffect(() => {
    if (!toast) return undefined;
    const id = setTimeout(() => setToast(''), 2600);
    return () => clearTimeout(id);
  }, [toast]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [route]);

  const nav = useMemo(
    () => ({
      tab: (name) => {
        haptic('select');
        setStack([{ name }]);
      },
      push: (name, params) => setStack((s) => [...s, { name, params }]),
      back: () => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s)),
      reset: (name = 'home') => setStack([{ name }]),
      replace: (name, params) => setStack((s) => [...s.slice(0, -1), { name, params }]),
    }),
    []
  );

  const toggleSave = useCallback(
    async (course) => {
      const isSaved = saved.includes(course.id);
      haptic('light');
      if (isSaved) {
        setSaved((s) => s.filter((id) => id !== course.id));
        setToast(t('removed'));
        return;
      }
      setSaved((s) => [...s, course.id]);
      if (inTelegram) {
        try {
          await api.saveCourse(course.id, lang);
          setToast(t('savedToBot'));
        } catch (e) {
          setToast(e.message);
        }
      } else {
        setToast(t('savedLocal'));
      }
    },
    [saved, lang, t]
  );

  const ctx = { t, lang, config, courses, saved, toggleSave, nav, match, setMatch, setToast };
  const canGoBack = stack.length > 1;
  const isTab = ['home', 'courses', 'saved'].includes(route.name);

  let screen = null;
  if (!config) {
    screen = loadError ? (
      <div className="center-state">
        <p>{t('loadError')}</p>
        <p className="hint small">{loadError}</p>
        <button className="btn" onClick={load}>
          {t('retry')}
        </button>
      </div>
    ) : (
      <div className="center-state">
        <div className="spinner" />
      </div>
    );
  } else if (route.name === 'home') screen = <Home {...ctx} />;
  else if (route.name === 'courses') screen = <Courses {...ctx} />;
  else if (route.name === 'saved') screen = <Saved {...ctx} />;
  else if (route.name === 'course') screen = <CourseDetail {...ctx} params={route.params} canGoBack={canGoBack} />;
  else if (route.name === 'enroll') screen = <Enroll {...ctx} params={route.params || {}} canGoBack={canGoBack} />;
  else if (route.name === 'ask') screen = <Ask {...ctx} canGoBack={canGoBack} />;
  else if (route.name === 'success') screen = <Success {...ctx} params={route.params || {}} />;

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-row">
          {canGoBack && !inTelegram ? (
            <button className="icon-btn" onClick={nav.back} aria-label={t('back')}>
              ←
            </button>
          ) : (
            <Logo src={config?.center?.logoUrl} />
          )}
          <div className="lang-switch" role="group" aria-label="Language">
            {LANGS.map((l) => (
              <button
                key={l}
                className={l === lang ? 'active' : ''}
                onClick={() => {
                  haptic('select');
                  setLang(l);
                }}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        {isTab && config && (
          <nav className="tabs">
            {[
              ['home', t('tabHome')],
              ['courses', t('tabCourses')],
              ['saved', `${t('tabSaved')}${saved.length ? ` · ${saved.length}` : ''}`],
            ].map(([name, label]) => (
              <button key={name} className={route.name === name ? 'active' : ''} onClick={() => nav.tab(name)}>
                {label}
              </button>
            ))}
          </nav>
        )}
      </header>

      <main className="content">{screen}</main>

      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </div>
  );
}
