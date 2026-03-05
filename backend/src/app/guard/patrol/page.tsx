'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Shift = {
  id: string;
  guardId: string;
  siteId: string;
  guard: { name: string };
  site: { location: string };
};

type PatrolLog = {
  id: string;
  checkpointName: string;
  timestamp: string;
  notes?: string;
};

export default function PatrolPage() {
  const router = useRouter();
  const [shift, setShift] = useState<Shift | null>(null);
  const [shiftId, setShiftId] = useState('');
  const [logs, setLogs] = useState<PatrolLog[]>([]);
  const [checkpoint, setCheckpoint] = useState('');
  const [notes, setNotes] = useState('');
  const [locStatus, setLocStatus] = useState<'idle' | 'loading' | 'ok' | 'denied'>('idle');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const id = sessionStorage.getItem('ots_shift_id') ?? '';
    setShiftId(id);
    if (!id) return;
    void Promise.all([
      fetch(`/api/shifts/${id}`).then(r => r.json() as Promise<{ shift: Shift }>),
      fetch(`/api/patrol-logs?shiftId=${id}`).then(r => r.json() as Promise<{ patrolLogs: PatrolLog[] }>),
    ]).then(([shiftData, logsData]) => {
      setShift(shiftData.shift);
      setLogs(logsData.patrolLogs ?? []);
    });
  }, []);

  const getLocation = () => {
    if (!navigator.geolocation) { setLocStatus('denied'); return; }
    setLocStatus('loading');
    navigator.geolocation.getCurrentPosition(
      pos => { setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setLocStatus('ok'); },
      () => setLocStatus('denied')
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shift || !checkpoint.trim()) return;
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/patrol-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shiftId: shift.id,
          guardId: shift.guardId,
          siteId: shift.siteId,
          checkpointName: checkpoint.trim(),
          timestamp: new Date().toISOString(),
          ...(coords && { latitude: coords.lat, longitude: coords.lng }),
          ...(notes.trim() && { notes: notes.trim() }),
        }),
      });
      if (!res.ok) {
        const d = (await res.json()) as { error?: string };
        setError(d.error ?? 'Failed to log patrol.');
        return;
      }
      const d = (await res.json()) as { patrolLog: PatrolLog };
      setLogs(prev => [...prev, d.patrolLog]);
      setCheckpoint('');
      setNotes('');
      setCoords(null);
      setLocStatus('idle');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!shiftId) {
    return (
      <div style={{ padding: '32px 20px', textAlign: 'center', color: '#64748b' }}>
        No active shift.{' '}
        <button onClick={() => router.push('/guard')} style={{ color: '#f97316', background: 'none', border: 'none', cursor: 'pointer' }}>Go back</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px 20px' }}>
      <button
        onClick={() => router.push('/guard')}
        style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0, marginBottom: 20, fontSize: 14 }}
      >
        ← Back
      </button>

      <h2 style={{ fontWeight: 700, fontSize: 22, marginBottom: 4 }}>Patrol Log</h2>
      {shift && (
        <p style={{ color: '#64748b', fontSize: 14, marginBottom: 28 }}>
          {shift.site.location} · {logs.length} checkpoint{logs.length !== 1 ? 's' : ''} logged
        </p>
      )}

      {/* Log form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
        <div>
          <label style={{ fontSize: 13, color: '#94a3b8', display: 'block', marginBottom: 8 }}>
            Checkpoint Name *
          </label>
          <input
            value={checkpoint}
            onChange={e => setCheckpoint(e.target.value)}
            required
            placeholder="e.g. North Gate, Parking Lot B, Lobby…"
            style={{
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: 10,
              padding: '14px 16px',
              color: '#e6e6e6',
              fontSize: 15,
              width: '100%',
              boxSizing: 'border-box',
              outline: 'none',
            }}
          />
        </div>

        <div>
          <label style={{ fontSize: 13, color: '#94a3b8', display: 'block', marginBottom: 8 }}>
            Notes (optional)
          </label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Observations at this checkpoint…"
            rows={2}
            style={{
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: 10,
              padding: '12px 16px',
              color: '#e6e6e6',
              fontSize: 14,
              width: '100%',
              boxSizing: 'border-box',
              resize: 'vertical',
              outline: 'none',
            }}
          />
        </div>

        {/* Location */}
        {locStatus === 'idle' && (
          <button
            type="button"
            onClick={getLocation}
            style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 10, padding: '10px 14px', color: '#94a3b8', fontSize: 13, cursor: 'pointer', textAlign: 'left' }}
          >
            📍 Capture GPS (optional)
          </button>
        )}
        {locStatus === 'loading' && <div style={{ color: '#64748b', fontSize: 13 }}>Getting location…</div>}
        {locStatus === 'ok' && coords && (
          <div style={{ background: '#052e16', border: '1px solid #166534', borderRadius: 8, padding: '8px 12px', color: '#86efac', fontSize: 12 }}>
            ✓ {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
          </div>
        )}

        {success && (
          <div style={{ background: '#052e16', border: '1px solid #166534', borderRadius: 8, padding: '10px 14px', color: '#86efac', fontSize: 14, textAlign: 'center' }}>
            ✓ Checkpoint logged!
          </div>
        )}
        {error && <p style={{ color: '#f87171', fontSize: 13, margin: 0 }}>{error}</p>}

        <button
          type="submit"
          disabled={saving}
          style={{
            background: '#2563eb',
            border: 'none',
            borderRadius: 10,
            padding: '14px',
            color: '#fff',
            fontWeight: 700,
            fontSize: 16,
            cursor: 'pointer',
          }}
        >
          {saving ? 'Logging…' : 'Log Checkpoint →'}
        </button>
      </form>

      {/* Log history */}
      {logs.length > 0 && (
        <div>
          <div style={{ fontSize: 13, color: '#64748b', marginBottom: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Today's Patrol
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[...logs].reverse().map((log, i) => (
              <div
                key={log.id}
                style={{
                  background: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: 10,
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    background: '#0f172a',
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#60a5fa',
                    flexShrink: 0,
                  }}
                >
                  {logs.length - i}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{log.checkpointName}</div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                    {new Date(log.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  {log.notes && (
                    <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>{log.notes}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
