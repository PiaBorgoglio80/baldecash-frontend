import { type ReactNode } from 'react';

export default function Modal({
  open, onClose, title, children,
}: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  if (!open) return null;
  return (
    <div style={{
      position:'fixed', inset:0, background:'rgba(0,0,0,.35)',
      display:'grid', placeItems:'center', zIndex:1000
    }}
      onClick={onClose}
    >
      <div style={{ background:'#fff', minWidth:380, maxWidth:520, padding:16, borderRadius:8 }}
           onClick={e=>e.stopPropagation()}>
        <header style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <h3 style={{ margin:0 }}>{title}</h3>
          <button onClick={onClose}>✕</button>
        </header>
        <div style={{ marginTop:12 }}>{children}</div>
      </div>
    </div>
  );
}
