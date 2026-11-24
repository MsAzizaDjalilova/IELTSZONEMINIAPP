import React, { useEffect, useRef } from 'react';
import { inTelegram, tg, versionAtLeast } from '../telegram.js';
import { reducedMotion } from './anim.jsx';

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// Bekzod Mirahmedov — telefon og'ishi / barmoq harakatiga qarab 3D qimirlaydigan "jonli" portret
export default function HeroPortrait({ src, alt, label }) {
  const stageRef = useRef(null);

  useEffect(() => {
    const el = stageRef.current;
    if (!el || reducedMotion()) return undefined;

    const target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    let raf;
    let lastInput = 0;
    const set = (x, y) => {
      target.x = clamp(x, -1, 1);
      target.y = clamp(y, -1, 1);
      lastInput = performance.now();
    };

    const hero = el.closest('.hero') || el;
    const onPointer = (e) => {
      const r = hero.getBoundingClientRect();
      set(((e.clientX - r.left) / r.width) * 2 - 1, ((e.clientY - r.top) / r.height) * 2 - 1);
    };
    const onLeave = () => set(0, 0);
    hero.addEventListener('pointermove', onPointer);
    hero.addEventListener('pointerleave', onLeave);

    // Telefon og'ishi (gyroskop)
    let baseBeta = null;
    const orient = (beta, gamma) => {
      if (beta == null || gamma == null) return;
      if (baseBeta === null) baseBeta = beta;
      set(gamma / 22, (beta - baseBeta) / 22);
    };
    const onWindowOrient = (e) => orient(e.beta, e.gamma);
    let tgOrient = null;
    if (inTelegram && versionAtLeast('8.0') && tg.DeviceOrientation) {
      tgOrient = () => {
        const d = tg.DeviceOrientation;
        orient((d.beta * 180) / Math.PI, (d.gamma * 180) / Math.PI);
      };
      try {
        tg.DeviceOrientation.start({ refresh_rate: 60 });
        tg.onEvent('deviceOrientationChanged', tgOrient);
      } catch {
        /* empty */
      }
    } else {
      window.addEventListener('deviceorientation', onWindowOrient);
    }

    const loop = (now) => {
      // Hech kim tegmasa — o'zi sekin "nafas olib" chayqaladi
      const idle = now - lastInput > 2500;
      const tx = idle ? Math.sin(now / 1900) * 0.45 : target.x;
      const ty = idle ? Math.cos(now / 2600) * 0.25 : target.y;
      cur.x += (tx - cur.x) * 0.07;
      cur.y += (ty - cur.y) * 0.07;
      el.style.setProperty('--ry', `${(cur.x * 16).toFixed(2)}deg`);
      el.style.setProperty('--rx', `${(-cur.y * 10).toFixed(2)}deg`);
      el.style.setProperty('--mx', cur.x.toFixed(3));
      el.style.setProperty('--my', cur.y.toFixed(3));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      hero.removeEventListener('pointermove', onPointer);
      hero.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('deviceorientation', onWindowOrient);
      if (tgOrient) {
        try {
          tg.offEvent('deviceOrientationChanged', tgOrient);
          tg.DeviceOrientation.stop();
        } catch {
          /* empty */
        }
      }
    };
  }, []);

  return (
    <div className="portrait" aria-hidden="false">
      <div className="portrait-stage" ref={stageRef}>
        <div className="p-layer p-halo" />
        <div className="p-layer p-ring" />
        <div className="p-layer p-ring p-ring2" />
        <div className="p-layer p-shadow" />
        <img className="p-layer p-img" src={src} alt={alt} draggable="false" />
        <div className="p-layer p-badge p-badge-score">
          <b>9.0</b>
          <span>Overall</span>
        </div>
        <div className="p-layer p-badge p-badge-live">
          <i /> {label}
        </div>
      </div>
    </div>
  );
}
