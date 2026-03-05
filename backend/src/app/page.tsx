import Link from 'next/link';

export default function HomePage() {
  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '2rem' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Lead Capture Backend</h1>
        <p style={{ color: '#9ca3af', marginBottom: '1.5rem' }}>
          API is running. Sign in to access operations portals.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link
            href="/login/admin"
            style={{
              display: 'inline-block',
              padding: '0.75rem 1.25rem',
              background: '#1d4ed8',
              color: '#fff',
              textDecoration: 'none',
              fontWeight: 700,
            }}
          >
            Admin Login
          </Link>
          <Link
            href="/login/guard"
            style={{
              display: 'inline-block',
              padding: '0.75rem 1.25rem',
              background: '#f97316',
              color: '#fff',
              textDecoration: 'none',
              fontWeight: 700,
            }}
          >
            Guard Login
          </Link>
        </div>
      </div>
    </main>
  );
}
