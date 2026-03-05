'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/dashboard', label: 'Leads' },
  { href: '/dashboard/guards', label: 'Guards' },
  { href: '/dashboard/clients', label: 'Clients' },
  { href: '/dashboard/sites', label: 'Sites' },
  { href: '/dashboard/shifts', label: 'Shifts' },
  { href: '/dashboard/incidents', label: 'Incidents' },
  { href: '/dashboard/reports', label: 'Reports' },
  { href: '/dashboard/check-ins', label: 'Check-ins' },
  { href: '/dashboard/patrol-logs', label: 'Patrol Logs' },
];

export default function AdminNav() {
  const pathname = usePathname();

  // Hide admin nav on the guard mobile portal
  if (pathname.startsWith('/guard')) return null;

  return (
    <nav
      style={{
        borderBottom: '1px solid #1e2228',
        padding: '0 2rem',
        display: 'flex',
        alignItems: 'center',
        gap: 0,
        background: '#080b10',
        overflowX: 'auto',
      }}
    >
      <span
        style={{
          marginRight: '1.5rem',
          fontWeight: 700,
          fontSize: 14,
          letterSpacing: '0.05em',
          color: '#60a5fa',
          padding: '1rem 0',
          whiteSpace: 'nowrap',
        }}
      >
        OTS OPS
      </span>
      {navLinks.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          style={{
            padding: '1rem 0.75rem',
            fontSize: 14,
            color: pathname === href || (href !== '/dashboard' && pathname.startsWith(href)) ? '#e6e6e6' : '#9ca3af',
            textDecoration: 'none',
            display: 'inline-block',
            whiteSpace: 'nowrap',
            borderBottom:
              pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
                ? '2px solid #3b82f6'
                : '2px solid transparent',
          }}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
