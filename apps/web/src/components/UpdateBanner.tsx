import { useRegisterSW } from 'virtual:pwa-register/react';
import type { Translation } from '../lib/translations';
export function UpdateBanner({ t }: { t: Translation }) {
  const { needRefresh: [needRefresh, setNeedRefresh], updateServiceWorker } = useRegisterSW({
    onRegisterError(error) { console.error('PWA registration error', error); }
  });
  if (!needRefresh) return null;
  return <div className="update-banner" role="status">
    <span>{t.update}</span>
    <button onClick={() => { void updateServiceWorker(true); }}>{t.install}</button>
    <button className="text-button" onClick={() => setNeedRefresh(false)}>{t.later}</button>
  </div>;
}
