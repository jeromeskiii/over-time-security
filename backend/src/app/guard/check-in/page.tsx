'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Shift = {
  id: string;
  guardId: string;
  siteId: string;
  guard: { name: string };
  site: { location: string };
  status: string;
};

export default function CheckInPage() {
  const router = useRouter();
  const [shift, setShift] = useState<Shift | null>(null);
  const [shiftId, setShiftId] = useState('');
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
    void fetch(`/api/shifts/${id}`)
      .then(r => r.json() as Promise<{ shift: Shift }>)
      .then(d => setShift(d.shift));
  }, []);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setLocStatus('denied');
      return;
    }
    setLocStatus('loading');
    navigator.geolocation.getCurrentPosition(
      pos => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocStatus('ok');
      },
      () => setLocStatus('denied')
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shift) return;
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/check-ins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shiftId: shift.id,
          guardId: shift.guardId,
          siteId: shift.siteId,
          timestamp: new Date().toISOString(),
          ...(coords && { latitude: coords.lat, longitude: coords.lng }),
          ...(notes && { notes }),
        }),
      });
      if (!res.ok) {
        const d = (await res.json()) as { error?: string };
        setError(d.error ?? 'Failed to check in.');
        return;
      }
      setSuccess(true);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!shiftId) {
    return (
      <div style={{ padding: '32px 20px', textAlign: 'center', color: '#64748b' }}>
        No active shift. <button onClick={() => router.push('/guard')} style={{ color: '#f97316', background: 'none', border: 'none', cursor: 'pointer' }}>Go back</button>
      </div>
    );
  }

  if (success) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
        <h2 style={{ fontWeight: 700, fontSize: 22, marginBottom: 8 }}>Checked In!</h2>
        <p style={{ color: '#64748b', fontSize: 14, marginBottom: 32 }}>
          Your check-in was logged at {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}.
        </p>
        <button
          onClick={() => router.push('/guard')}
          style={{
            background: '#f97316',
            border: 'none',
            borderRadius: 10,
            padding: '14px 32px',
            color: '#fff',
            fontWeight: 700,
            fontSize: 16,
            cursor: 'pointer',
          }}
        >
          Back to Home
        </button>
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

      <h2 style={{ fontWeight: 700, fontSize: 22, marginBottom: 4 }}>Check In</h2>
      {shift && (
        <p style={{ color: '#64748b', fontSize: 14, marginBottom: 28 }}>
          {shift.site.location} · {shift.guard.name}
        </p>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Location */}
        <div>
          <label style={{ fontSize: 13, color: '#94a3b8', display: 'block', marginBottom: 8 }}>
            Location
          </label>
          {locStatus === 'idle' && (
            <button
              type="button"
              onClick={getLocation}
              style={{
                background: '#1e293b',
                border: '1px solid #334155',
                borderRadius: 10,
                padding: '12px 16px',
                color: '#e6e6e6',
                fontSize: 14,
                cursor: 'pointer',
                width: '100%',
                textAlign: 'left',
              }}
            >
              📍 Capture GPS Location (optional)
            </button>
          )}
          {locStatus === 'loading' && (
            <div style={{ color: '#64748b', fontSize: 14, padding: '12px 0' }}>Getting location…</div>
          )}
          {locStatus === 'ok' && coords && (
            <div
              style={{
                background: '#052e16',
                border: '1px solid #166534',
                borderRadius: 10,
                padding: '12px 16px',
                color: '#86efac',
                fontSize: 13,
              }}
            >
              ✓ {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
            </div>
          )}
          {locStatus === 'denied' && (
            <div style={{ color: '#f87171', fontSize: 13 }}>
              Location access denied. Check-in will be logged without GPS.
            </div>
          )}
        </div>

        {/* Notes */}
        <div>
          <label style={{ fontSize: 13, color: '#94a3b8', display: 'block', marginBottom: 8 }}>
            Notes (optional)
          </label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Anything to note on arrival…"
            rows={3}
            style={{
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: 10,
              padding: '14px 16px',
              color: '#e6e6e6',
              fontSize: 15,
              width: '100%',
              boxSizing: 'border-box',
              resize: 'vertical',
              outline: 'none',
            }}
          />
        </div>

        <div style={{ fontSize: 13, color: '#475569', background: '#1e293b', borderRadius: 10, padding: '10px 14px' }}>
          🕐 Check-in time: <strong>{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</strong>
        </div>

        {error && <p style={{ color: '#f87171', fontSize: 13, margin: 0 }}>{error}</p>}

        <button
          type="submit"
          disabled={saving}
          style={{
            background: '#f97316',
            border: 'none',
            borderRadius: 10,
            padding: '16px',
            color: '#fff',
            fontWeight: 700,
            fontSize: 17,
            cursor: 'pointer',
          }}
        >
          {saving ? 'Logging Check-in…' : 'Confirm Check-in ✓'}
        </button>
      </form>
    </div>
  );
}
