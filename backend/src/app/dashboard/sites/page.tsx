'use client';

import { useEffect, useState } from 'react';

type Client = { id: string; name: string };

type Site = {
  id: string;
  clientId: string;
  client: { name: string };
  location: string;
  instructions: string | null;
  createdAt: string;
};

const th = { textAlign: 'left' as const, borderBottom: '1px solid #333', padding: 8 };
const td = { borderBottom: '1px solid #222', padding: 8 };

export default function SitesPage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState({ clientId: '', location: '', instructions: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setIsLoading(true);
    try {
      const [sitesRes, clientsRes] = await Promise.all([fetch('/api/sites'), fetch('/api/clients')]);
      const sitesData = (await sitesRes.json()) as { sites?: Site[] };
      const clientsData = (await clientsRes.json()) as { clients?: Client[] };
      setSites(sitesData.sites ?? []);
      setClients(clientsData.clients ?? []);
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
      const res = await fetch('/api/sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const d = (await res.json()) as { error?: string };
        setError(d.error ?? 'Failed to create site.');
        return;
      }
      setForm({ clientId: '', location: '', instructions: '' });
      await load();
    } finally {
      setSaving(false);
    }
  };

  const deleteSite = async (id: string) => {
    if (!confirm('Delete this site?')) return;
    await fetch(`/api/sites/${id}`, { method: 'DELETE' });
    await load();
  };

  return (
    <main style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ marginBottom: '1.5rem', fontSize: '1.75rem' }}>Sites</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 12, color: '#9ca3af' }}>Client *</label>
          <select value={form.clientId} onChange={e => setForm(f => ({ ...f, clientId: e.target.value }))} required style={{ padding: '6px 8px', background: '#111', border: '1px solid #333', color: '#e6e6e6', borderRadius: 4, minWidth: 160 }}>
            <option value="">Select client…</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 12, color: '#9ca3af' }}>Location *</label>
          <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} required placeholder="123 Main St" style={{ padding: '6px 8px', background: '#111', border: '1px solid #333', color: '#e6e6e6', borderRadius: 4, minWidth: 220 }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 12, color: '#9ca3af' }}>Instructions</label>
          <input value={form.instructions} onChange={e => setForm(f => ({ ...f, instructions: e.target.value }))} placeholder="Special access notes…" style={{ padding: '6px 8px', background: '#111', border: '1px solid #333', color: '#e6e6e6', borderRadius: 4, minWidth: 220 }} />
        </div>
        <button type="submit" disabled={saving} style={{ padding: '6px 16px', background: '#1d4ed8', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          {saving ? 'Saving…' : 'Add Site'}
        </button>
        {error && <span style={{ color: '#f87171', fontSize: 13 }}>{error}</span>}
      </form>

      {isLoading ? <p>Loading sites…</p> : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={th}>Created</th>
                <th style={th}>Client</th>
                <th style={th}>Location</th>
                <th style={th}>Instructions</th>
                <th style={th}></th>
              </tr>
            </thead>
            <tbody>
              {sites.map(s => (
                <tr key={s.id}>
                  <td style={td}>{new Date(s.createdAt).toLocaleDateString()}</td>
                  <td style={td}>{s.client.name}</td>
                  <td style={td}>{s.location}</td>
                  <td style={{ ...td, maxWidth: 300 }}>{s.instructions ?? '-'}</td>
                  <td style={td}>
                    <button onClick={() => deleteSite(s.id)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}>Delete</button>
                  </td>
                </tr>
              ))}
              {sites.length === 0 && (
                <tr><td colSpan={5} style={{ padding: 12, color: '#9ca3af' }}>No sites found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
