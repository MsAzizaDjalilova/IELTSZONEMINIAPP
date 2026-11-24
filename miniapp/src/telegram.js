import { useEffect, useRef } from 'react';

export const tg = typeof window !== 'undefined' ? window.Telegram?.WebApp : undefined;

// Telegram ichida ochilganmi (brauzerda emas)
export const inTelegram = Boolean(tg && tg.initData);

const BRAND = '#E5E62A';
const BRAND_TEXT = '#111111';

export function initTelegram() {
  if (!inTelegram) {
    document.documentElement.classList.add('is-browser');
    return;
  }
  document.documentElement.classList.add('is-telegram');
  tg.ready();
  tg.expand();
  try {
    tg.disableVerticalSwipes?.();
  } catch {
    /* eski versiyalar */
  }
  const apply = () => document.documentElement.setAttribute('data-scheme', tg.colorScheme || 'light');
  apply();
  tg.onEvent('themeChanged', apply);
}

export function tgUser() {
  return inTelegram ? tg.initDataUnsafe?.user || null : null;
}

export function startParam() {
  const fromTg = inTelegram ? tg.initDataUnsafe?.start_param : null;
  if (fromTg) return fromTg;
  return new URLSearchParams(window.location.search).get('enroll') ? `enroll_${new URLSearchParams(window.location.search).get('enroll')}` : null;
}

export function haptic(type = 'light') {
  if (!inTelegram || !tg.HapticFeedback) return;
  if (type === 'success' || type === 'error' || type === 'warning') tg.HapticFeedback.notificationOccurred(type);
  else if (type === 'select') tg.HapticFeedback.selectionChanged();
  else tg.HapticFeedback.impactOccurred(type);
}

export function openLink(url) {
  if (!url) return;
  if (inTelegram && /^https:\/\/t\.me\//.test(url)) return tg.openTelegramLink(url);
  if (inTelegram && /^https?:/.test(url)) return tg.openLink(url);
  window.open(url, '_blank', 'noopener');
}

export function versionAtLeast(v) {
  return inTelegram && typeof tg.isVersionAtLeast === 'function' && tg.isVersionAtLeast(v);
}

// Telegram'dan telefon raqamni so'rash (6.9+)
export function requestPhone() {
  return new Promise((resolve) => {
    if (!versionAtLeast('6.9') || !tg.requestContact) return resolve(null);
    tg.requestContact((ok, res) => {
      const phone = ok ? res?.responseUnsafe?.contact?.phone_number : null;
      resolve(phone ? (phone.startsWith('+') ? phone : `+${phone}`) : ok ? '' : null);
    });
  });
}

/* ---------- Telegram MainButton (brauzerda — oddiy pastki tugma) ---------- */

export function useMainButton({ text, onClick, visible = true, loading = false, disabled = false }) {
  const handler = useRef(onClick);
  handler.current = onClick;

  useEffect(() => {
    if (!inTelegram) return undefined;
    const mb = tg.MainButton;
    const cb = () => handler.current && handler.current();
    mb.onClick(cb);
    return () => {
      mb.offClick(cb);
    };
  }, []);

  useEffect(() => {
    if (!inTelegram) return;
    const mb = tg.MainButton;
    if (!visible || !text) {
      mb.hideProgress();
      mb.hide();
      return;
    }
    mb.setParams({ text, color: BRAND, text_color: BRAND_TEXT, is_active: !disabled, is_visible: true });
    if (loading) mb.showProgress(false);
    else mb.hideProgress();
  }, [text, visible, loading, disabled]);

  useEffect(
    () => () => {
      if (inTelegram) tg.MainButton.hide();
    },
    []
  );
}

/* ---------- Telegram BackButton ---------- */

export function useBackButton(onBack) {
  const handler = useRef(onBack);
  handler.current = onBack;
  const visible = Boolean(onBack);

  useEffect(() => {
    if (!inTelegram) return undefined;
    const bb = tg.BackButton;
    const cb = () => handler.current && handler.current();
    bb.onClick(cb);
    return () => bb.offClick(cb);
  }, []);

  useEffect(() => {
    if (!inTelegram) return;
    if (visible) tg.BackButton.show();
    else tg.BackButton.hide();
  }, [visible]);
}
