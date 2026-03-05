'use client';

import { useEffect, useState } from 'react';

type Incident = { id: string; description: string; severity: string; occurredAt: string };

type Report = {
  id: string;
  content: string;
  createdAt: string;
  incident: { description: string; severity: string; occurredAt: string };
};

const th = { textAlign: 'left' as const, borderBottom: '1px solid #333', padding: 8 };
const td = { borderBottom: '1px solid #222', padding: 8 };

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState({ incidentId: '', content: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setIsLoading(true);
    try {
      const [repRes, incRes] = await Promise.all([fetch('/api/reports'), fetch('/api/incidents')]);
      const repData = (await repRes.json()) as { reports?: Report[] };
      const incData = (await incRes.json()) as { incidents?: Incident[] };
      setReports(repData.reports ?? []);
      setIncidents(incData.incidents ?? []);
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
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const d = (await res.json()) as { error?: string };
        setError(d.error ?? 'Failed to create report.');
        return;
      }
      setForm({ incidentId: '', content: '' });
      await load();
    } finally {
      setSaving(false);
    }
  };

  return (
    <main style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ marginBottom: '1.5rem', fontSize: '1.75rem' }}>Reports</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 12, color: '#9ca3af' }}>Incident *</label>
          <select value={form.incidentId} onChange={e => setForm(f => ({ ...f, incidentId: e.target.value }))} required style={{ padding: '6px 8px', background: '#111', border: '1px solid #333', color: '#e6e6e6', borderRadius: 4, minWidth: 280 }}>
            <option value="">Select incident…</option>
            {incidents.map(i => (
              <option key={i.id} value={i.id}>
                [{i.severity}] {new Date(i.occurredAt).toLocaleDateString()} — {i.description.slice(0, 60)}
              </option>
            ))}
          </select>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 12, color: '#9ca3af' }}>Content *</label>
          <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} required rows={3} placeholder="Detailed report narrative…" style={{ padding: '6px 8px', background: '#111', border: '1px solid #333', color: '#e6e6e6', borderRadius: 4, minWidth: 340, resize: 'vertical' }} />
        </div>
        <button type="submit" disabled={saving} style={{ padding: '6px 16px', background: '#1d4ed8', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', alignSelf: 'flex-end' }}>
          {saving ? 'Saving…' : 'Create Report'}
        </button>
        {error && <span style={{ color: '#f87171', fontSize: 13 }}>{error}</span>}
      </form>

      {isLoading ? <p>Loading reports…</p> : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={th}>Created</th>
                <th style={th}>Incident</th>
                <th style={th}>Severity</th>
                <th style={th}>Content</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(r => (
                <tr key={r.id}>
                  <td style={td}>{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td style={{ ...td, maxWidth: 280 }}>{r.incident.description.slice(0, 80)}</td>
                  <td style={td}>{r.incident.severity}</td>
                  <td style={{ ...td, maxWidth: 400 }}>{r.content.slice(0, 120)}{r.content.length > 120 ? '…' : ''}</td>
                </tr>
              ))}
              {reports.length === 0 && (
                <tr><td colSpan={4} style={{ padding: 12, color: '#9ca3af' }}>No reports found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
