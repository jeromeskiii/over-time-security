'use client';

import { useEffect, useState } from 'react';

type GuardStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

type Guard = {
  id: string;
  name: string;
  licenseNumber: string;
  phone: string;
  status: GuardStatus;
  createdAt: string;
};

const statusOptions: GuardStatus[] = ['ACTIVE', 'INACTIVE', 'SUSPENDED'];

const th = { textAlign: 'left' as const, borderBottom: '1px solid #333', padding: 8 };
const td = { borderBottom: '1px solid #222', padding: 8 };

export default function GuardsPage() {
  const [guards, setGuards] = useState<Guard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState({ name: '', licenseNumber: '', phone: '', status: 'ACTIVE' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/guards');
      const data = (await res.json()) as { guards?: Guard[] };
      setGuards(data.guards ?? []);
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
      const res = await fetch('/api/guards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const d = (await res.json()) as { error?: string };
        setError(d.error ?? 'Failed to create guard.');
        return;
      }
      setForm({ name: '', licenseNumber: '', phone: '', status: 'ACTIVE' });
      await load();
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (id: string, status: GuardStatus) => {
    await fetch(`/api/guards/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    await load();
  };

  const deleteGuard = async (id: string) => {
    if (!confirm('Delete this guard?')) return;
    await fetch(`/api/guards/${id}`, { method: 'DELETE' });
    await load();
  };

  return (
    <main style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ marginBottom: '1.5rem', fontSize: '1.75rem' }}>Guards</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 12, color: '#9ca3af' }}>Name *</label>
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required placeholder="Full name" style={{ padding: '6px 8px', background: '#111', border: '1px solid #333', color: '#e6e6e6', borderRadius: 4 }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 12, color: '#9ca3af' }}>License # *</label>
          <input value={form.licenseNumber} onChange={e => setForm(f => ({ ...f, licenseNumber: e.target.value }))} required placeholder="TX-12345" style={{ padding: '6px 8px', background: '#111', border: '1px solid #333', color: '#e6e6e6', borderRadius: 4 }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 12, color: '#9ca3af' }}>Phone *</label>
          <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} required placeholder="555-1234" style={{ padding: '6px 8px', background: '#111', border: '1px solid #333', color: '#e6e6e6', borderRadius: 4 }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 12, color: '#9ca3af' }}>Status</label>
          <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} style={{ padding: '6px 8px', background: '#111', border: '1px solid #333', color: '#e6e6e6', borderRadius: 4 }}>
            {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <button type="submit" disabled={saving} style={{ padding: '6px 16px', background: '#1d4ed8', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          {saving ? 'Saving…' : 'Add Guard'}
        </button>
        {error && <span style={{ color: '#f87171', fontSize: 13 }}>{error}</span>}
      </form>

      {isLoading ? <p>Loading guards…</p> : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={th}>Created</th>
                <th style={th}>Name</th>
                <th style={th}>License #</th>
                <th style={th}>Phone</th>
                <th style={th}>Status</th>
                <th style={th}></th>
              </tr>
            </thead>
            <tbody>
              {guards.map(g => (
                <tr key={g.id}>
                  <td style={td}>{new Date(g.createdAt).toLocaleDateString()}</td>
                  <td style={td}>{g.name}</td>
                  <td style={td}>{g.licenseNumber}</td>
                  <td style={td}>{g.phone}</td>
                  <td style={td}>
                    <select value={g.status} onChange={e => updateStatus(g.id, e.target.value as GuardStatus)} style={{ background: '#111', border: '1px solid #333', color: '#e6e6e6', padding: '2px 4px', borderRadius: 4 }}>
                      {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td style={td}>
                    <button onClick={() => deleteGuard(g.id)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}>Delete</button>
                  </td>
                </tr>
              ))}
              {guards.length === 0 && (
                <tr><td colSpan={6} style={{ padding: 12, color: '#9ca3af' }}>No guards found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
