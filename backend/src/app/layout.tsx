import type { ReactNode } from 'react';
import AdminNav from './AdminNav';

export const metadata = {
  title: 'Overtime Security - Operations Dashboard',
  description: 'Guard operations dashboard',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'Inter, sans-serif', backgroundColor: '#05070a', color: '#e6e6e6' }}>
        <AdminNav />
        {children}
      </body>
    </html>
  );
}