import type { Metadata } from 'next';
import './lakshya.css';

export const metadata: Metadata = {
  title: 'Lakshya | Animesh Basak',
  description: 'AI job hunting OS',
};

export default function LakshyaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'var(--lk-bg)',
        fontFamily: 'var(--lk-font)',
      }}
    >
      {/* Purple radial glow — matches portfolio hero */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'radial-gradient(ellipse 80% 50% at 70% -10%, rgba(139,92,246,0.15) 0%, transparent 60%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}
