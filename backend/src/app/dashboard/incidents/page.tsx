'use client';

import { useEffect, useState } from 'react';

type IncidentSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

type Guard = { id: string; name: string };
type Site = { id: string; location: string };

type Incident = {
  id: string;
  guard: { name: string };
  site: { location: string };
  description: string;
  severity: IncidentSeverity;
  occurredAt: string;
  createdAt: string;
};

const severityOptions: IncidentSeverity[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

const severityColor: Record<IncidentSeverity, string> = {
  LOW: '#6b7280',
  MEDIUM: '#d97706',
  HIGH: '#dc2626',
  CRITICAL: '#7c3aed',
};

const th = { textAlign: 'left' as const, borderBottom: '1px solid #333', padding: 8 };
const td = { borderBottom: '1px solid #222', padding: 8 };

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [guards, setGuards] = useState<Guard[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState({ guardId: '', siteId: '', description: '', severity: 'LOW', occurredAt: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setIsLoading(true);
    try {
      const [incRes, guardsRes, sitesRes] = await Promise.all([
        fetch('/api/incidents'),
        fetch('/api/guards'),
        fetch('/api/sites'),
      ]);
      const incData = (await incRes.json()) as { incidents?: Incident[] };
      const guardsData = (await guardsRes.json()) as { guards?: Guard[] };
      const sitesData = (await sitesRes.json()) as { sites?: Site[] };
      setIncidents(incData.incidents ?? []);
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
      const res = await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, occurredAt: new Date(form.occurredAt).toISOString() }),
      });
      if (!res.ok) {
        const d = (await res.json()) as { error?: string };
        setError(d.error ?? 'Failed to log incident.');
        return;
      }
      setForm({ guardId: '', siteId: '', description: '', severity: 'LOW', occurredAt: '' });
      await load();
    } finally {
      setSaving(false);
    }
  };

  return (
    <main style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ marginBottom: '1.5rem', fontSize: '1.75rem' }}>Incidents</h1>

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
          <label style={{ fontSize: 12, color: '#9ca3af' }}>Description *</label>
          <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required placeholder="What happened?" style={{ padding: '6px 8px', background: '#111', border: '1px solid #333', color: '#e6e6e6', borderRadius: 4, minWidth: 260 }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 12, color: '#9ca3af' }}>Severity</label>
          <select value={form.severity} onChange={e => setForm(f => ({ ...f, severity: e.target.value }))} style={{ padding: '6px 8px', background: '#111', border: '1px solid #333', color: '#e6e6e6', borderRadius: 4 }}>
            {severityOptions.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 12, color: '#9ca3af' }}>Occurred At *</label>
          <input type="datetime-local" value={form.occurredAt} onChange={e => setForm(f => ({ ...f, occurredAt: e.target.value }))} required style={{ padding: '6px 8px', background: '#111', border: '1px solid #333', color: '#e6e6e6', borderRadius: 4 }} />
        </div>
        <button type="submit" disabled={saving} style={{ padding: '6px 16px', background: '#1d4ed8', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          {saving ? 'Saving…' : 'Log Incident'}
        </button>
        {error && <span style={{ color: '#f87171', fontSize: 13 }}>{error}</span>}
      </form>

      {isLoading ? <p>Loading incidents…</p> : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={th}>Occurred</th>
                <th style={th}>Guard</th>
                <th style={th}>Site</th>
                <th style={th}>Severity</th>
                <th style={th}>Description</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map(i => (
                <tr key={i.id}>
                  <td style={td}>{new Date(i.occurredAt).toLocaleString()}</td>
                  <td style={td}>{i.guard.name}</td>
                  <td style={td}>{i.site.location}</td>
                  <td style={td}><span style={{ color: severityColor[i.severity], fontWeight: 600 }}>{i.severity}</span></td>
                  <td style={{ ...td, maxWidth: 360 }}>{i.description}</td>
                </tr>
              ))}
              {incidents.length === 0 && (
                <tr><td colSpan={5} style={{ padding: 12, color: '#9ca3af' }}>No incidents found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
