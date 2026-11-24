import React, { useEffect, useState } from 'react';
import { auth, setUnauthorizedHandler } from './api.js';
import Login from './pages/Login.jsx';
import Leads from './pages/Leads.jsx';
import Courses from './pages/Courses.jsx';

export default function App() {
  const [authed, setAuthed] = useState(() => Boolean(auth.get()));
  const [page, setPage] = useState(() => (window.location.hash === '#courses' ? 'courses' : 'leads'));

  useEffect(() => {
    setUnauthorizedHandler(() => setAuthed(false));
  }, []);

  useEffect(() => {
    window.location.hash = page;
  }, [page]);

  if (!authed) return <Login onSuccess={() => setAuthed(true)} />;

  return (
    <div className="layout">
      <header className="nav">
        <div className="nav-inner">
          <div className="brand">
            <img src="https://ieltszone.uz/images/ielts-zone-logo-no-bg.svg" alt="" onError={(e) => (e.currentTarget.style.display = 'none')} />
            <span>Admin</span>
          </div>
          <nav className="nav-links">
            <button className={page === 'leads' ? 'active' : ''} onClick={() => setPage('leads')}>
              So‘rovlar
            </button>
            <button className={page === 'courses' ? 'active' : ''} onClick={() => setPage('courses')}>
              Kurslar
            </button>
          </nav>
          <button
            className="btn btn-ghost sm"
            onClick={() => {
              auth.clear();
              setAuthed(false);
            }}
          >
            Chiqish
          </button>
        </div>
      </header>
      <main className="main">{page === 'leads' ? <Leads /> : <Courses />}</main>
    </div>
  );
}
