import { useEffect, useState } from 'react';
import { BookOpen, Compass, ShieldCheck, SunMoon, Wifi, WifiOff, Download, Upload } from 'lucide-react';
import type { Locale } from '@dnd/shared';
import { isLocale } from '@dnd/shared';
import { readPreference, storePreference } from './lib/local-db';
import { translations } from './lib/translations';
import { UpdateBanner } from './components/UpdateBanner';
import { CharacterManager } from './features/CharacterManager';
import { exportCharacters, importCharacters } from './features/characters';

type Theme = 'light'|'dark';

export function App() {
  const [locale,setLocale] = useState<Locale>('it');
  const [theme,setTheme] = useState<Theme>('light');
  const [online,setOnline] = useState(navigator.onLine);
  const [toast,setToast] = useState('');
  const [hasUnsaved,setHasUnsaved] = useState(false);
  const t=translations[locale];

  useEffect(()=>{
    let mounted=true;
    Promise.all([readPreference('locale'),readPreference('theme')]).then(([lang, savedTheme])=>{
      if(!mounted)return;
      if(isLocale(lang))setLocale(lang);
      if(savedTheme==='dark'||savedTheme==='light')setTheme(savedTheme);
      else if(window.matchMedia('(prefers-color-scheme: dark)').matches)setTheme('dark');
    }).catch(()=>{ if(mounted && window.matchMedia('(prefers-color-scheme: dark)').matches)setTheme('dark'); });
    const onOnline=()=>setOnline(true), onOffline=()=>setOnline(false);
    window.addEventListener('online',onOnline);window.addEventListener('offline',onOffline);
    return ()=>{mounted=false;window.removeEventListener('online',onOnline);window.removeEventListener('offline',onOffline);};
  },[]);
  useEffect(()=>{document.documentElement.dataset.theme=theme;document.documentElement.lang=locale;},[theme,locale]);
  function changeLocale(value:Locale) {setLocale(value);void storePreference('locale',value).catch(console.warn);}
  function changeTheme() {const next=theme==='light'?'dark':'light';setTheme(next);void storePreference('theme',next).catch(console.warn);}
  async function backup() {
    try {
      const json=await exportCharacters();
      const blob=new Blob([json],{type:'application/json'});
      const url=URL.createObjectURL(blob);
      const a=document.createElement('a');a.href=url;a.download=`schede-dnd-backup-${new Date().toISOString().slice(0,10)}.json`;a.click();
      URL.revokeObjectURL(url);
      setToast(locale==='it'?'Backup esportato.':'Backup exported.');
    } catch(e) { setToast(e instanceof Error?e.message:String(e)); }
  }
  async function restoreBackup(file?: File) {
    if(!file)return;
    try {
      const count=await importCharacters(await file.text());
      setToast(locale==='it'?`Importati ${count} personaggi.`:`Imported ${count} characters.`);
      window.location.reload();
    } catch(e) { setToast(e instanceof Error?e.message:String(e)); }
  }

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark"><BookOpen size={29} strokeWidth={1.6}/></div><div><strong>SCHEDE <em>D&D</em></strong><small>THE CHARACTER ARCHIVE</small></div></div>
      <div className="sidebar-label">{locale==='it'?'Archivio locale':'Private archive'}</div>
      <nav className="side-nav" aria-label={locale==='it'?'Navigazione principale':'Main navigation'}>
        <button className="nav-item selected" aria-current="page"><Compass size={19}/><span>{locale==='it'?'Personaggi':'Characters'}</span></button>
      </nav>
      <div className="sidebar-bottom"><div className="seal"><ShieldCheck size={17}/><span>{locale==='it'?'Dati sul dispositivo':'Device-only storage'}</span></div><span className="sidebar-foot">EST. 2026 <span className="dot">✦</span> VERSION 0.2.1</span></div>
    </aside>
    <div className="workspace">
      <header className="topbar">
        <div className="crumb"><span>APP SCHEDE D&D</span><strong>{locale==='it'?'Personaggi':'Characters'}</strong></div>
        <div className="top-actions">
          <div className="net" role="status"><span className={online?'online-led':'offline-led'}>{online?<Wifi size={16}/>:<WifiOff size={16}/>}</span><span>{online?t.online:t.offline}</span></div>
          <label className="sr-only" htmlFor="lang">{t.language}</label>
          <select id="lang" aria-label={t.language} value={locale} onChange={e=>changeLocale(e.target.value as Locale)}><option value="it">IT</option><option value="en">EN</option></select>
          <button className="icon-button" onClick={changeTheme} aria-label={t.themeToggle} title={t.theme}><SunMoon size={19}/></button>
          <button className="secondary-button" onClick={()=>void backup()} title={locale==='it'?'Esporta backup JSON':'Export JSON backup'}><Download size={15}/>{locale==='it'?'Esporta':'Export'}</button>
          <label className="secondary-button" style={{display:'inline-flex',alignItems:'center',gap:'.4rem',cursor:'pointer'}}><Upload size={15}/>{locale==='it'?'Importa':'Import'}<input type="file" accept="application/json,.json" hidden onChange={e=>{void restoreBackup(e.target.files?.[0]);e.currentTarget.value='';}}/></label>
        </div>
      </header>
      <UpdateBanner t={t}/>
      <main className="main-content">
        <div className="eyebrow"><span className="eyebrow-line"/>{locale==='it'?'Archivio locale · Personaggi':'Phase 2 · Accounts and characters'}<span className="eyebrow-line"/></div>
        {toast && <div className="success-message" role="status">{toast}<button className="notice-close" onClick={()=>setToast('')} aria-label={locale==='it'?'Chiudi':'Close'}>×</button></div>}
        <CharacterManager locale={locale} onUnsavedChange={setHasUnsaved}/>
        <footer className="footer"><span>✦</span>{t.about}<span>✦</span></footer>
      </main>
    </div>
  </div>;
}
