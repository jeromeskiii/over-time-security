'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Shift = {
  id: string;
  guardId: string;
  guard: { name: string };
  site: { location: string };
  startTime: string;
  endTime: string;
  status: string;
};

type CheckIn = { id: string; timestamp: string };

const btn = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  background: '#1e293b',
  border: '1px solid #334155',
  borderRadius: 12,
  padding: '16px 20px',
  color: '#e6e6e6',
  textDecoration: 'none',
  width: '100%',
  fontSize: 16,
  fontWeight: 600,
  cursor: 'pointer',
} as const;

export default function GuardHomePage() {
  const [shiftId, setShiftId] = useState('');
  const [inputId, setInputId] = useState('');
  const [shift, setShift] = useState<Shift | null>(null);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Restore saved shiftId from sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem('ots_shift_id');
    if (saved) {
      setShiftId(saved);
    }
  }, []);

  useEffect(() => {
    if (!shiftId) return;
    void loadShift(shiftId);
  }, [shiftId]);

  const loadShift = async (id: string) => {
    setLoading(true);
    setError('');
    try {
      const [shiftRes, checkInRes] = await Promise.all([
        fetch(`/api/shifts/${id}`),
        fetch(`/api/check-ins?shiftId=${id}`),
      ]);
      if (!shiftRes.ok) {
        setError('Shift not found. Please check your Shift ID.');
        sessionStorage.removeItem('ots_shift_id');
        setShiftId('');
        return;
      }
      const shiftData = (await shiftRes.json()) as { shift: Shift };
      const checkInData = (await checkInRes.json()) as { checkIns: CheckIn[] };
      setShift(shiftData.shift);
      setCheckIns(checkInData.checkIns ?? []);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputId.trim();
    if (!trimmed) return;
    sessionStorage.setItem('ots_shift_id', trimmed);
    setShiftId(trimmed);
  };

  const handleClearShift = () => {
    sessionStorage.removeItem('ots_shift_id');
    setShiftId('');
    setShift(null);
    setCheckIns([]);
    setInputId('');
  };

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  if (!shiftId) {
    return (
      <div style={{ padding: '32px 20px' }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Welcome Back 👋</h2>
        <p style={{ color: '#64748b', fontSize: 14, marginBottom: 32 }}>
          Enter your Shift ID to begin your shift workflow.
        </p>

        <form onSubmit={handleLookup} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <label style={{ fontSize: 13, color: '#94a3b8' }}>Shift ID</label>
          <input
            value={inputId}
            onChange={e => setInputId(e.target.value)}
            placeholder="e.g. clx2abc123..."
            autoFocus
            style={{
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: 10,
              padding: '14px 16px',
              color: '#e6e6e6',
              fontSize: 15,
              outline: 'none',
            }}
          />
          {error && <p style={{ color: '#f87171', fontSize: 13, margin: 0 }}>{error}</p>}
          <button
            type="submit"
            disabled={loading}
            style={{
              background: '#f97316',
              border: 'none',
              borderRadius: 10,
              padding: '14px',
              color: '#fff',
              fontWeight: 700,
              fontSize: 16,
              cursor: 'pointer',
              marginTop: 4,
            }}
          >
            {loading ? 'Loading…' : 'Load Shift →'}
          </button>
        </form>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: '32px 20px', textAlign: 'center', color: '#64748b' }}>
        Loading shift…
      </div>
    );
  }

  if (!shift) return null;

  const hasCheckedIn = checkIns.length > 0;
  const statusColor: Record<string, string> = {
    SCHEDULED: '#f59e0b',
    IN_PROGRESS: '#22c55e',
    COMPLETED: '#64748b',
    CANCELLED: '#ef4444',
  };

  return (
    <div style={{ padding: '24px 20px' }}>
      {/* Shift card */}
      <div
        style={{
          background: '#1e293b',
          border: '1px solid #334155',
          borderRadius: 16,
          padding: 20,
          marginBottom: 28,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>TODAY'S SHIFT</div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>{shift.site.location}</div>
          </div>
          <span
            style={{
              background: statusColor[shift.status] ?? '#334155',
              color: '#fff',
              fontSize: 11,
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: 99,
            }}
          >
            {shift.status.replace('_', ' ')}
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            { label: 'Guard', value: shift.guard.name },
            { label: 'Date', value: formatDate(shift.startTime) },
            { label: 'Start', value: formatTime(shift.startTime) },
            { label: 'End', value: formatTime(shift.endTime) },
          ].map(({ label, value }) => (
            <div key={label} style={{ background: '#0f172a', borderRadius: 8, padding: '10px 12px' }}>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 2 }}>{label}</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{value}</div>
            </div>
          ))}
        </div>
        {hasCheckedIn && (
          <div
            style={{
              marginTop: 12,
              background: '#052e16',
              border: '1px solid #166534',
              borderRadius: 8,
              padding: '8px 12px',
              fontSize: 13,
              color: '#86efac',
            }}
          >
            ✓ Checked in at {formatTime(checkIns[checkIns.length - 1].timestamp)}
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Link href={`/guard/check-in`} style={{ ...btn, borderColor: hasCheckedIn ? '#166534' : '#334155' }}>
          <span style={{ fontSize: 24 }}>📍</span>
          <div>
            <div>{hasCheckedIn ? 'Log Another Check-in' : 'Check In to Shift'}</div>
            <div style={{ fontSize: 12, color: '#64748b', fontWeight: 400 }}>
              {hasCheckedIn ? `${checkIns.length} check-in${checkIns.length !== 1 ? 's' : ''} logged` : 'Mark your arrival'}
            </div>
          </div>
        </Link>

        <Link href="/guard/patrol" style={btn}>
          <span style={{ fontSize: 24 }}>🔦</span>
          <div>
            <div>Log Patrol</div>
            <div style={{ fontSize: 12, color: '#64748b', fontWeight: 400 }}>Record checkpoint visits</div>
          </div>
        </Link>

        <Link href="/guard/incident" style={{ ...btn, borderColor: '#7f1d1d' }}>
          <span style={{ fontSize: 24 }}>⚠️</span>
          <div>
            <div>Report Incident</div>
            <div style={{ fontSize: 12, color: '#64748b', fontWeight: 400 }}>Log with photos &amp; details</div>
          </div>
        </Link>
      </div>

      <button
        onClick={handleClearShift}
        style={{
          marginTop: 32,
          background: 'transparent',
          border: '1px solid #334155',
          borderRadius: 8,
          padding: '10px 20px',
          color: '#64748b',
          fontSize: 13,
          cursor: 'pointer',
          width: '100%',
        }}
      >
        Switch Shift
      </button>
    </div>
  );
}
