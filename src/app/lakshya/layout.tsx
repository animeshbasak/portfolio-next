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
  return <>{children}</>;
}
