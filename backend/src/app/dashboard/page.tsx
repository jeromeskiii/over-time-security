'use client';

import { useEffect, useMemo, useState } from 'react';

type LeadStatus = 'new' | 'contacted' | 'quoted' | 'won' | 'lost';

type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string | null;
  serviceType: string;
  message: string;
  status: Uppercase<LeadStatus>;
  createdAt: string;
};

const statusOptions: LeadStatus[] = ['new', 'contacted', 'quoted', 'won', 'lost'];

function normalizeStatus(status: Lead['status']): LeadStatus {
  return status.toLowerCase() as LeadStatus;
}

export default function DashboardPage() {
  const [statusFilter, setStatusFilter] = useState<'all' | LeadStatus>('all');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingLeadId, setUpdatingLeadId] = useState<string | null>(null);

  const endpoint = useMemo(() => {
    const base = '/api/leads';
    if (statusFilter === 'all') return base;
    return `${base}?status=${statusFilter}`;
  }, [statusFilter]);

  const loadLeads = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(endpoint);
      const result = (await response.json()) as { leads?: Lead[] };
      setLeads(result.leads ?? []);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadLeads();
  }, [endpoint]);

  const updateStatus = async (id: string, status: LeadStatus) => {
    setUpdatingLeadId(id);
    try {
      await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      await loadLeads();
    } finally {
      setUpdatingLeadId(null);
    }
  };

  return (
    <main style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ marginBottom: '1rem', fontSize: '1.75rem' }}>Sales Dashboard</h1>

      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="status-filter" style={{ marginRight: 8 }}>
          Filter by status:
        </label>
        <select
          id="status-filter"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as 'all' | LeadStatus)}
        >
          <option value="all">all</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <p>Loading leads...</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #333', padding: 8 }}>Created</th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #333', padding: 8 }}>Name</th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #333', padding: 8 }}>Company</th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #333', padding: 8 }}>Service</th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #333', padding: 8 }}>Contact</th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #333', padding: 8 }}>Message</th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #333', padding: 8 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td style={{ borderBottom: '1px solid #222', padding: 8 }}>
                    {new Date(lead.createdAt).toLocaleString()}
                  </td>
                  <td style={{ borderBottom: '1px solid #222', padding: 8 }}>{lead.name}</td>
                  <td style={{ borderBottom: '1px solid #222', padding: 8 }}>{lead.company ?? '-'}</td>
                  <td style={{ borderBottom: '1px solid #222', padding: 8 }}>{lead.serviceType}</td>
                  <td style={{ borderBottom: '1px solid #222', padding: 8 }}>
                    <div>{lead.email}</div>
                    <div>{lead.phone}</div>
                  </td>
                  <td style={{ borderBottom: '1px solid #222', padding: 8, maxWidth: 320 }}>{lead.message}</td>
                  <td style={{ borderBottom: '1px solid #222', padding: 8 }}>
                    <select
                      value={normalizeStatus(lead.status)}
                      onChange={(event) => updateStatus(lead.id, event.target.value as LeadStatus)}
                      disabled={updatingLeadId === lead.id}
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: 12, color: '#9ca3af' }}>
                    No leads found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
