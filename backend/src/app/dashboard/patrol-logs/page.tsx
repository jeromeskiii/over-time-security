'use client';

import { useEffect, useState } from 'react';

type PatrolLog = {
  id: string;
  shiftId: string;
  checkpointName: string;
  timestamp: string;
  latitude?: number | null;
  longitude?: number | null;
  notes?: string | null;
  guard: { name: string };
  site: { location: string };
};

const th = { textAlign: 'left' as const, borderBottom: '1px solid #333', padding: 8 };
const td = { borderBottom: '1px solid #222', padding: 8 };

export default function PatrolLogsPage() {
  const [patrolLogs, setPatrolLogs] = useState<PatrolLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/patrol-logs');
      const result = (await response.json()) as { patrolLogs?: PatrolLog[]; error?: string };
      if (!response.ok) {
        setError(result.error ?? 'Failed to fetch patrol logs.');
        return;
      }
      setPatrolLogs(result.patrolLogs ?? []);
    } catch {
      setError('Network error while fetching patrol logs.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  return (
    <main style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ marginBottom: '1.5rem', fontSize: '1.75rem' }}>Patrol Logs</h1>

      {isLoading ? <p>Loading patrol logs...</p> : null}
      {error ? <p style={{ color: '#f87171' }}>{error}</p> : null}

      {!isLoading && !error ? (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={th}>Timestamp</th>
                <th style={th}>Guard</th>
                <th style={th}>Site</th>
                <th style={th}>Checkpoint</th>
                <th style={th}>Shift ID</th>
                <th style={th}>GPS</th>
                <th style={th}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {patrolLogs.map((log) => {
                const hasGps = log.latitude !== undefined && log.latitude !== null && log.longitude !== undefined && log.longitude !== null;
                const gps = hasGps ? `${log.latitude?.toFixed(5)}, ${log.longitude?.toFixed(5)}` : '-';

                return (
                  <tr key={log.id}>
                    <td style={td}>{new Date(log.timestamp).toLocaleString()}</td>
                    <td style={td}>{log.guard.name}</td>
                    <td style={td}>{log.site.location}</td>
                    <td style={td}>{log.checkpointName}</td>
                    <td style={td}>{log.shiftId}</td>
                    <td style={td}>{gps}</td>
                    <td style={{ ...td, maxWidth: 320 }}>{log.notes?.trim() || '-'}</td>
                  </tr>
                );
              })}
              {patrolLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: 12, color: '#9ca3af' }}>
                    No patrol logs found.
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
