import type { ReactNode } from 'react';

export const metadata = {
  title: 'OTS Guard Portal',
  description: 'Overtime Security — Guard Mobile App',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function GuardLayout({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        minHeight: '100dvh',
        background: '#0a0d12',
        color: '#e6e6e6',
        fontFamily: 'Inter, system-ui, sans-serif',
        maxWidth: 480,
        margin: '0 auto',
        position: 'relative',
        paddingBottom: 80,
      }}
    >
      {/* Top bar */}
      <header
        style={{
          background: '#0f172a',
          borderBottom: '1px solid #1e293b',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            background: '#f97316',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: 14,
            color: '#fff',
            flexShrink: 0,
          }}
        >
          OT
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.2 }}>Overtime Security</div>
          <div style={{ fontSize: 11, color: '#64748b' }}>Guard Portal</div>
        </div>
      </header>

      {children}
    </div>
  );
}
