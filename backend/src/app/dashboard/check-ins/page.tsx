'use client';

import { useEffect, useState } from 'react';

type CheckIn = {
  id: string;
  shiftId: string;
  timestamp: string;
  latitude?: number | null;
  longitude?: number | null;
  notes?: string | null;
  guard: { name: string };
  site: { location: string };
};

const th = { textAlign: 'left' as const, borderBottom: '1px solid #333', padding: 8 };
const td = { borderBottom: '1px solid #222', padding: 8 };

export default function CheckInsPage() {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/check-ins');
      const result = (await response.json()) as { checkIns?: CheckIn[]; error?: string };
      if (!response.ok) {
        setError(result.error ?? 'Failed to fetch check-ins.');
        return;
      }
      setCheckIns(result.checkIns ?? []);
    } catch {
      setError('Network error while fetching check-ins.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  return (
    <main style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ marginBottom: '1.5rem', fontSize: '1.75rem' }}>Check-ins</h1>

      {isLoading ? <p>Loading check-ins...</p> : null}
      {error ? <p style={{ color: '#f87171' }}>{error}</p> : null}

      {!isLoading && !error ? (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={th}>Timestamp</th>
                <th style={th}>Guard</th>
                <th style={th}>Site</th>
                <th style={th}>Shift ID</th>
                <th style={th}>GPS</th>
                <th style={th}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {checkIns.map((checkIn) => {
                const hasGps = checkIn.latitude !== undefined && checkIn.latitude !== null && checkIn.longitude !== undefined && checkIn.longitude !== null;
                const gps = hasGps
                  ? `${checkIn.latitude?.toFixed(5)}, ${checkIn.longitude?.toFixed(5)}`
                  : '-';

                return (
                  <tr key={checkIn.id}>
                    <td style={td}>{new Date(checkIn.timestamp).toLocaleString()}</td>
                    <td style={td}>{checkIn.guard.name}</td>
                    <td style={td}>{checkIn.site.location}</td>
                    <td style={td}>{checkIn.shiftId}</td>
                    <td style={td}>{gps}</td>
                    <td style={{ ...td, maxWidth: 360 }}>{checkIn.notes?.trim() || '-'}</td>
                  </tr>
                );
              })}
              {checkIns.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: 12, color: '#9ca3af' }}>
                    No check-ins found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      ) : null}
    </main>
  );
}
