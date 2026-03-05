'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';

type IncidentSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
type IncidentType = 'THEFT' | 'VANDALISM' | 'TRESPASS' | 'MEDICAL' | 'FIRE' | 'SUSPICIOUS_ACTIVITY' | 'OTHER';

type Shift = {
  id: string;
  guardId: string;
  siteId: string;
  guard: { name: string };
  site: { location: string };
};

const severityOptions: IncidentSeverity[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const typeOptions: IncidentType[] = [
  'THEFT',
  'VANDALISM',
  'TRESPASS',
  'MEDICAL',
  'FIRE',
  'SUSPICIOUS_ACTIVITY',
  'OTHER',
];

const MAX_FILES = 5;
const ACCEPTED_IMAGE_TYPES = 'image/jpeg,image/png,image/webp,image/heic,image/heif';

const extensionTypeMap: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  heic: 'image/heic',
  heif: 'image/heif',
};

function toLabel(value: string): string {
  return value.replace(/_/g, ' ');
}

function inferContentType(file: File): string | null {
  if (file.type) return file.type.toLowerCase();
  const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
  return extensionTypeMap[extension] ?? null;
}

type PresignResponse = {
  uploadUrl?: string;
  key?: string;
  maxFileBytes?: number;
  error?: string;
};

export default function GuardIncidentPage() {
  const router = useRouter();
  const [shiftId, setShiftId] = useState('');
  const [shift, setShift] = useState<Shift | null>(null);
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<IncidentSeverity>('MEDIUM');
  const [type, setType] = useState<IncidentType>('OTHER');
  const [saving, setSaving] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const id = sessionStorage.getItem('ots_shift_id') ?? '';
    setShiftId(id);
    if (!id) return;

    void fetch(`/api/shifts/${id}`)
      .then((response) => response.json() as Promise<{ shift: Shift; error?: string }>)
      .then((result) => {
        if (result.shift) setShift(result.shift);
      });
  }, []);

  const handlePhotoSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? []);
    if (selected.length > MAX_FILES) {
      setError(`Please select at most ${MAX_FILES} photos.`);
      setPhotos(selected.slice(0, MAX_FILES));
      return;
    }

    setError('');
    setPhotos(selected);
  };

  const uploadPhoto = async (file: File): Promise<string> => {
    const contentType = inferContentType(file);
    if (!contentType) {
      throw new Error(`Unsupported file type for "${file.name}".`);
    }

    const presignResponse = await fetch('/api/upload/presign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filename: file.name,
        contentType,
        folder: 'incidents',
        fileSizeBytes: file.size,
      }),
    });

    const presignBody = (await presignResponse.json().catch(() => null)) as PresignResponse | null;
    if (!presignResponse.ok || !presignBody?.uploadUrl || !presignBody.key) {
      throw new Error(presignBody?.error ?? `Failed to prepare upload for "${file.name}".`);
    }

    if (presignBody.maxFileBytes && file.size > presignBody.maxFileBytes) {
      throw new Error(`"${file.name}" exceeds max upload size.`);
    }

    const uploadResponse = await fetch(presignBody.uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': contentType },
      body: file,
    });

    if (!uploadResponse.ok) {
      throw new Error(`Failed to upload "${file.name}".`);
    }

    return presignBody.key;
  };

  const submitIncident = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!shift) return;

    setSaving(true);
    setSuccess(false);
    setError('');

    try {
      const photoKeys: string[] = [];
      if (photos.length > 0) {
        setUploadingPhotos(true);
        for (const photo of photos) {
          const key = await uploadPhoto(photo);
          photoKeys.push(key);
        }
      }

      const response = await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guardId: shift.guardId,
          siteId: shift.siteId,
          shiftId: shift.id,
          description: description.trim(),
          severity,
          type,
          occurredAt: new Date().toISOString(),
          ...(photoKeys.length > 0 && { photoKeys }),
        }),
      });

      if (!response.ok) {
        const body = (await response.json()) as { error?: string };
        setError(body.error ?? 'Failed to submit incident.');
        return;
      }

      setSuccess(true);
      setDescription('');
      setPhotos([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
      setUploadingPhotos(false);
    }
  };

  if (!shiftId) {
    return (
      <div style={{ padding: '32px 20px', textAlign: 'center', color: '#64748b' }}>
        No active shift.{' '}
        <button
          onClick={() => router.push('/guard')}
          style={{ color: '#f97316', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px 20px' }}>
      <button
        onClick={() => router.push('/guard')}
        style={{
          background: 'none',
          border: 'none',
          color: '#94a3b8',
          cursor: 'pointer',
          padding: 0,
          marginBottom: 20,
          fontSize: 14,
        }}
      >
        ← Back
      </button>

      <h2 style={{ fontWeight: 700, fontSize: 22, marginBottom: 4 }}>Report Incident</h2>
      {shift ? (
        <p style={{ color: '#64748b', fontSize: 14, marginBottom: 20 }}>
          {shift.site.location} · {shift.guard.name}
        </p>
      ) : (
        <p style={{ color: '#64748b', fontSize: 14, marginBottom: 20 }}>Loading shift context...</p>
      )}

      {success ? (
        <div
          style={{
            background: '#052e16',
            border: '1px solid #166534',
            borderRadius: 10,
            padding: '12px 16px',
            color: '#86efac',
            fontSize: 14,
            marginBottom: 18,
          }}
        >
          Incident submitted successfully.
        </div>
      ) : null}

      <form onSubmit={submitIncident} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>
            <label style={{ fontSize: 13, color: '#94a3b8', display: 'block', marginBottom: 8 }}>Severity</label>
            <select
              value={severity}
              onChange={(event) => setSeverity(event.target.value as IncidentSeverity)}
              style={{
                width: '100%',
                background: '#1e293b',
                border: '1px solid #334155',
                borderRadius: 10,
                padding: '12px',
                color: '#e6e6e6',
              }}
            >
              {severityOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: 13, color: '#94a3b8', display: 'block', marginBottom: 8 }}>Type</label>
            <select
              value={type}
              onChange={(event) => setType(event.target.value as IncidentType)}
              style={{
                width: '100%',
                background: '#1e293b',
                border: '1px solid #334155',
                borderRadius: 10,
                padding: '12px',
                color: '#e6e6e6',
              }}
            >
              {typeOptions.map((option) => (
                <option key={option} value={option}>
                  {toLabel(option)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label style={{ fontSize: 13, color: '#94a3b8', display: 'block', marginBottom: 8 }}>
            Description
          </label>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Describe what happened, who was involved, and immediate actions taken."
            rows={6}
            required
            style={{
              width: '100%',
              boxSizing: 'border-box',
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: 10,
              padding: '14px 16px',
              color: '#e6e6e6',
              fontSize: 15,
              resize: 'vertical',
              outline: 'none',
            }}
          />
        </div>

        <div>
          <label style={{ fontSize: 13, color: '#94a3b8', display: 'block', marginBottom: 8 }}>
            Photos (optional, up to {MAX_FILES})
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_IMAGE_TYPES}
            multiple
            onChange={handlePhotoSelection}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: 10,
              padding: '10px 12px',
              color: '#e6e6e6',
              fontSize: 14,
            }}
          />
          {photos.length > 0 ? (
            <div style={{ marginTop: 8, display: 'grid', gap: 4 }}>
              {photos.map((photo) => (
                <span key={`${photo.name}-${photo.size}`} style={{ fontSize: 12, color: '#94a3b8' }}>
                  {photo.name} ({(photo.size / 1024).toFixed(1)} KB)
                </span>
              ))}
            </div>
          ) : null}
        </div>

        {error ? <p style={{ color: '#f87171', fontSize: 13, margin: 0 }}>{error}</p> : null}

        <button
          type="submit"
          disabled={saving || uploadingPhotos || !shift || !description.trim()}
          style={{
            background: '#dc2626',
            border: 'none',
            borderRadius: 10,
            padding: '14px',
            color: '#fff',
            fontWeight: 700,
            fontSize: 16,
            cursor: 'pointer',
            opacity: saving || uploadingPhotos || !shift || !description.trim() ? 0.65 : 1,
          }}
        >
          {uploadingPhotos ? 'Uploading photos...' : saving ? 'Submitting...' : 'Submit Incident'}
        </button>
      </form>
    </div>
  );
}
