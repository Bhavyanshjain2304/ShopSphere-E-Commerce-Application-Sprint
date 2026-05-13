import { useEffect, useState } from 'react';

const TOASTS = [];
let listeners = [];

export const toast = {
  success: (msg) => addToast(msg, 'success'),
  error: (msg) => addToast(msg, 'error'),
};

function addToast(message, type) {
  const id = Date.now();
  TOASTS.push({ id, message, type });
  listeners.forEach(fn => fn([...TOASTS]));
  setTimeout(() => {
    const idx = TOASTS.findIndex(t => t.id === id);
    if (idx !== -1) TOASTS.splice(idx, 1);
    listeners.forEach(fn => fn([...TOASTS]));
  }, 3000);
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    listeners.push(setToasts);
    return () => { listeners = listeners.filter(fn => fn !== setToasts); };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl text-sm font-semibold text-white min-w-[220px] animate-slide-up
            ${t.type === 'success' ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-rose-600'}`}>
          <span className="text-base">{t.type === 'success' ? '✓' : '✕'}</span>
          {t.message}
        </div>
      ))}
    </div>
  );
}
