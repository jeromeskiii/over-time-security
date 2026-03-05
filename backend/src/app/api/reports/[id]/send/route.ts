import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';
import { R2_PUBLIC_URL } from '@/lib/r2';

export const runtime = 'nodejs';
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function corsHeaders() {
  const origin = process.env.FRONTEND_ORIGIN ?? 'http://localhost:3000';
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function normalizeHeaderValue(value: string): string {
  return value.replace(/[\r\n]+/g, ' ').trim();
}

function toPublicPhotoUrl(key: string): string | null {
  const base = R2_PUBLIC_URL.trim().replace(/\/+$/g, '');
  if (!base) return null;

  const encodedKey = key
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');

  try {
    const url = new URL(`${base}/${encodedKey}`);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
    return url.toString();
  } catch {
    return null;
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const report = await prisma.report.findUnique({
      where: { id },
      include: {
        incident: {
          include: {
            guard: { select: { name: true, phone: true } },
            site: {
              include: {
                client: { select: { name: true, email: true } },
              },
            },
          },
        },
      },
    });

    if (!report) {
      return NextResponse.json({ error: 'Report not found.' }, { status: 404, headers: corsHeaders() });
    }

    const clientEmailRaw = report.incident.site.client.email?.trim() ?? '';
    if (!clientEmailRaw || !emailRegex.test(clientEmailRaw)) {
      return NextResponse.json(
        { error: 'Client has no valid email address on file.' },
        { status: 422, headers: corsHeaders() }
      );
    }
    const clientEmail = normalizeHeaderValue(clientEmailRaw);

    const inc = report.incident;
    const photoUrls =
      inc.photoKeys.length > 0 && R2_PUBLIC_URL
        ? inc.photoKeys
            .map((key) => toPublicPhotoUrl(key))
            .filter((url): url is string => Boolean(url))
        : [];

    const photoHtml =
      photoUrls.length > 0
        ? `<h3 style="color:#1e293b;margin-top:24px">Photos</h3>
           <div style="display:flex;flex-wrap:wrap;gap:8px">
             ${photoUrls
               .map(
                 (url) =>
                   `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">
                      <img src="${escapeHtml(url)}" alt="Incident photo"
                           style="width:200px;height:150px;object-fit:cover;border-radius:6px;border:1px solid #e2e8f0" />
                    </a>`
               )
               .join('')}
           </div>`
        : '';

    const occurredAtFormatted = new Date(inc.occurredAt).toLocaleString('en-US', {
      timeZone: 'America/Los_Angeles',
      dateStyle: 'full',
      timeStyle: 'short',
    });

    const safeSeverity = escapeHtml(String(inc.severity));
    const safeReportId = escapeHtml(report.id);
    const safeIncidentType = escapeHtml(inc.type.replace(/_/g, ' '));
    const safeLocation = escapeHtml(inc.site.location);
    const safeGuardName = escapeHtml(inc.guard.name);
    const safeOccurredAt = escapeHtml(occurredAtFormatted);
    const safePhotoCount = escapeHtml(String(photoUrls.length));
    const safeDescription = escapeHtml(inc.description);
    const safeReportContent = escapeHtml(report.content);

    const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="font-family:Inter,sans-serif;background:#f8fafc;margin:0;padding:0">
  <div style="max-width:680px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)">
    <!-- Header -->
    <div style="background:#0f172a;padding:24px 32px;display:flex;align-items:center;justify-content:space-between">
      <div>
        <div style="color:#f97316;font-weight:700;font-size:20px;letter-spacing:.04em">OVER TIME SECURITY</div>
        <div style="color:#94a3b8;font-size:13px;margin-top:4px">Incident Report</div>
      </div>
      <div style="background:#f97316;color:#fff;padding:6px 14px;border-radius:99px;font-size:12px;font-weight:600">
        ${safeSeverity}
      </div>
    </div>

    <!-- Body -->
    <div style="padding:32px">
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
        <tbody>
          <tr>
            <td style="padding:10px 0;color:#64748b;font-size:13px;width:160px">Report ID</td>
            <td style="padding:10px 0;color:#1e293b;font-size:13px;font-weight:500">${safeReportId}</td>
          </tr>
          <tr style="background:#f8fafc">
            <td style="padding:10px 8px;color:#64748b;font-size:13px">Incident Type</td>
            <td style="padding:10px 8px;color:#1e293b;font-size:13px;font-weight:500">${safeIncidentType}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;color:#64748b;font-size:13px">Location</td>
            <td style="padding:10px 0;color:#1e293b;font-size:13px;font-weight:500">${safeLocation}</td>
          </tr>
          <tr style="background:#f8fafc">
            <td style="padding:10px 8px;color:#64748b;font-size:13px">Guard</td>
            <td style="padding:10px 8px;color:#1e293b;font-size:13px;font-weight:500">${safeGuardName}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;color:#64748b;font-size:13px">Occurred</td>
            <td style="padding:10px 0;color:#1e293b;font-size:13px;font-weight:500">${safeOccurredAt}</td>
          </tr>
          <tr style="background:#f8fafc">
            <td style="padding:10px 8px;color:#64748b;font-size:13px">Photos</td>
            <td style="padding:10px 8px;color:#1e293b;font-size:13px;font-weight:500">${safePhotoCount}</td>
          </tr>
        </tbody>
      </table>

      <h3 style="color:#1e293b;margin:0 0 8px">Description</h3>
      <p style="color:#374151;line-height:1.6;background:#f8fafc;padding:16px;border-radius:8px;margin:0 0 16px;border-left:3px solid #f97316">
        ${safeDescription}
      </p>

      <h3 style="color:#1e293b;margin:0 0 8px">Report Narrative</h3>
      <p style="color:#374151;line-height:1.6;background:#f8fafc;padding:16px;border-radius:8px;margin:0;white-space:pre-wrap">
        ${safeReportContent}
      </p>

      ${photoHtml}
    </div>

    <!-- Footer -->
    <div style="background:#f1f5f9;padding:20px 32px;text-align:center;color:#94a3b8;font-size:12px">
      This report was automatically generated by Overtime Security.
      For questions, contact us at info@overtimesecurity.com.
    </div>
  </div>
</body>
</html>`;

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      return NextResponse.json({ error: 'Email provider is not configured.' }, { status: 503, headers: corsHeaders() });
    }

    const resend = new Resend(resendApiKey);
    const fromEmailRaw = (process.env.REPORT_FROM_EMAIL ?? 'reports@overtimesecurity.com').trim();
    const fromEmail = emailRegex.test(fromEmailRaw) ? fromEmailRaw : 'reports@overtimesecurity.com';
    const subjectLocation = normalizeHeaderValue(inc.site.location).slice(0, 120) || 'Unknown Location';
    const subjectDate = new Date(inc.occurredAt).toLocaleDateString();

    await resend.emails.send({
      from: `Overtime Security <${fromEmail}>`,
      to: clientEmail,
      subject: `Incident Report — ${subjectLocation} — ${subjectDate}`,
      html,
    });

    const updated = await prisma.report.update({
      where: { id },
      data: {
        sentAt: new Date(),
        sentTo: clientEmail,
      },
    });

    return NextResponse.json({ success: true, report: updated }, { status: 200, headers: corsHeaders() });
  } catch (err) {
    console.error('[send-report] Error:', err);
    return NextResponse.json({ error: 'Failed to send report.' }, { status: 500, headers: corsHeaders() });
  }
}
