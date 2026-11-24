import React, { useState } from 'react';
import { api, auth } from '../api.js';

export default function Login({ onSuccess }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token } = await api.login(password);
      auth.set(token);
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <form className="login-card" onSubmit={submit}>
        <img src="https://ieltszone.uz/images/ielts-zone-logo-no-bg.svg" alt="IELTS ZONE" className="login-logo" />
        <h1>Admin Panel</h1>
        <p className="hint">Davom etish uchun parolni kiriting</p>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Parol" autoFocus />
        {error && <div className="error">{error}</div>}
        <button className="btn btn-primary" disabled={loading || !password}>
          {loading ? 'Tekshirilmoqda…' : 'Kirish'}
        </button>
      </form>
    </div>
  );
}
