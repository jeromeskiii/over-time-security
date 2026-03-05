'use client';

import { useEffect, useState } from 'react';

type ShiftStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

type Guard = { id: string; name: string };
type Site = { id: string; location: string };

type Shift = {
  id: string;
  guardId: string;
  siteId: string;
  guard: { name: string };
  site: { location: string };
  startTime: string;
  endTime: string;
  status: ShiftStatus;
  createdAt: string;
};

const statusOptions: ShiftStatus[] = ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

const th = { textAlign: 'left' as const, borderBottom: '1px solid #333', padding: 8 };
const td = { borderBottom: '1px solid #222', padding: 8 };

export default function ShiftsPage() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [guards, setGuards] = useState<Guard[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState({ guardId: '', siteId: '', startTime: '', endTime: '', status: 'SCHEDULED' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setIsLoading(true);
    try {
      const [shiftsRes, guardsRes, sitesRes] = await Promise.all([
        fetch('/api/shifts'),
        fetch('/api/guards'),
        fetch('/api/sites'),
      ]);
      const shiftsData = (await shiftsRes.json()) as { shifts?: Shift[] };
      const guardsData = (await guardsRes.json()) as { guards?: Guard[] };
      const sitesData = (await sitesRes.json()) as { sites?: Site[] };
      setShifts(shiftsData.shifts ?? []);
      setGuards(guardsData.guards ?? []);
      setSites(sitesData.sites ?? []);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/shifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const d = (await res.json()) as { error?: string };
        setError(d.error ?? 'Failed to create shift.');
        return;
      }
      setForm({ guardId: '', siteId: '', startTime: '', endTime: '', status: 'SCHEDULED' });
      await load();
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (id: string, status: ShiftStatus) => {
    await fetch(`/api/shifts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    await load();
  };

  return (
    <main style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ marginBottom: '1.5rem', fontSize: '1.75rem' }}>Shifts</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 12, color: '#9ca3af' }}>Guard *</label>
          <select value={form.guardId} onChange={e => setForm(f => ({ ...f, guardId: e.target.value }))} required style={{ padding: '6px 8px', background: '#111', border: '1px solid #333', color: '#e6e6e6', borderRadius: 4, minWidth: 160 }}>
            <option value="">Select guard…</option>
            {guards.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 12, color: '#9ca3af' }}>Site *</label>
          <select value={form.siteId} onChange={e => setForm(f => ({ ...f, siteId: e.target.value }))} required style={{ padding: '6px 8px', background: '#111', border: '1px solid #333', color: '#e6e6e6', borderRadius: 4, minWidth: 160 }}>
            <option value="">Select site…</option>
            {sites.map(s => <option key={s.id} value={s.id}>{s.location}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 12, color: '#9ca3af' }}>Start *</label>
          <input type="datetime-local" value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))} required style={{ padding: '6px 8px', background: '#111', border: '1px solid #333', color: '#e6e6e6', borderRadius: 4 }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 12, color: '#9ca3af' }}>End *</label>
          <input type="datetime-local" value={form.endTime} onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))} required style={{ padding: '6px 8px', background: '#111', border: '1px solid #333', color: '#e6e6e6', borderRadius: 4 }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 12, color: '#9ca3af' }}>Status</label>
          <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} style={{ padding: '6px 8px', background: '#111', border: '1px solid #333', color: '#e6e6e6', borderRadius: 4 }}>
            {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <button type="submit" disabled={saving} style={{ padding: '6px 16px', background: '#1d4ed8', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          {saving ? 'Saving…' : 'Schedule Shift'}
        </button>
        {error && <span style={{ color: '#f87171', fontSize: 13 }}>{error}</span>}
      </form>

      {isLoading ? <p>Loading shifts…</p> : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={th}>Guard</th>
                <th style={th}>Site</th>
                <th style={th}>Start</th>
                <th style={th}>End</th>
                <th style={th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {shifts.map(s => (
                <tr key={s.id}>
                  <td style={td}>{s.guard.name}</td>
                  <td style={td}>{s.site.location}</td>
                  <td style={td}>{new Date(s.startTime).toLocaleString()}</td>
                  <td style={td}>{new Date(s.endTime).toLocaleString()}</td>
                  <td style={td}>
                    <select value={s.status} onChange={e => updateStatus(s.id, e.target.value as ShiftStatus)} style={{ background: '#111', border: '1px solid #333', color: '#e6e6e6', padding: '2px 4px', borderRadius: 4 }}>
                      {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
              {shifts.length === 0 && (
                <tr><td colSpan={5} style={{ padding: 12, color: '#9ca3af' }}>No shifts found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
