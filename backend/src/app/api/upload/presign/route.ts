import { NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { r2Client, R2_BUCKET } from '@/lib/r2';
import { randomUUID } from 'crypto';

export const runtime = 'nodejs';

const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10MB
const MAX_FILENAME_LENGTH = 120;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 min
const RATE_LIMIT_REQUESTS = 30;

const ALLOWED_FOLDERS = new Set(['incidents', 'reports']);

const EXTENSIONS_BY_CONTENT_TYPE: Record<string, string[]> = {
  'image/jpeg': ['jpg', 'jpeg'],
  'image/png': ['png'],
  'image/webp': ['webp'],
  'image/heic': ['heic'],
  'image/heif': ['heif'],
};

const rateLimitBuckets = new Map<string, { count: number; windowStart: number }>();

function corsHeaders() {
  const origin = process.env.FRONTEND_ORIGIN ?? 'http://localhost:3000';
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}

function getClientIdentifier(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const first = forwardedFor.split(',')[0]?.trim();
    if (first) return first;
  }

  const realIp = request.headers.get('x-real-ip')?.trim();
  if (realIp) return realIp;

  return 'unknown';
}

function exceedsRateLimit(clientId: string): boolean {
  const now = Date.now();
  const bucket = rateLimitBuckets.get(clientId);

  if (!bucket || now - bucket.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitBuckets.set(clientId, { count: 1, windowStart: now });
    return false;
  }

  if (bucket.count >= RATE_LIMIT_REQUESTS) {
    return true;
  }

  bucket.count += 1;
  return false;
}

function normalizeFilename(filename: string): string {
  const basename = filename.split(/[\\/]/).pop() ?? '';
  const compact = basename.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9._-]/g, '');
  return compact.slice(0, MAX_FILENAME_LENGTH);
}

function getExtension(filename: string): string | null {
  if (!filename.includes('.')) return null;
  const extension = filename.split('.').pop()?.toLowerCase().trim();
  return extension || null;
}

export async function POST(request: Request) {
  try {
    const clientId = getClientIdentifier(request);
    if (exceedsRateLimit(clientId)) {
      return NextResponse.json(
        { error: 'Too many upload requests. Please try again shortly.' },
        { status: 429, headers: corsHeaders() }
      );
    }

    const body = (await request.json()) as {
      filename?: string;
      contentType?: string;
      folder?: string;
      fileSizeBytes?: number;
    };

    const filenameRaw = typeof body.filename === 'string' ? body.filename.trim() : 'upload';
    const filename = normalizeFilename(filenameRaw) || 'upload';
    const contentType = typeof body.contentType === 'string' ? body.contentType.trim().toLowerCase() : '';
    const folder = typeof body.folder === 'string' ? body.folder.trim() : 'incidents';
    const fileSizeBytes = body.fileSizeBytes;

    if (!ALLOWED_FOLDERS.has(folder)) {
      return NextResponse.json({ error: 'Invalid upload folder.' }, { status: 400, headers: corsHeaders() });
    }

    const allowedExtensions = EXTENSIONS_BY_CONTENT_TYPE[contentType];
    if (!allowedExtensions) {
      return NextResponse.json({ error: 'Unsupported content type.' }, { status: 400, headers: corsHeaders() });
    }

    if (
      fileSizeBytes !== undefined &&
      (!Number.isFinite(fileSizeBytes) || fileSizeBytes <= 0 || fileSizeBytes > MAX_FILE_BYTES)
    ) {
      return NextResponse.json(
        { error: `Invalid file size. Max allowed is ${MAX_FILE_BYTES} bytes.` },
        { status: 400, headers: corsHeaders() }
      );
    }

    const extension = getExtension(filename);
    if (extension && !allowedExtensions.includes(extension)) {
      return NextResponse.json(
        { error: `File extension does not match content type ${contentType}.` },
        { status: 400, headers: corsHeaders() }
      );
    }

    const keyExtension = allowedExtensions[0];
    const key = `${folder}/${randomUUID()}.${keyExtension}`;

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(r2Client, command, { expiresIn: 900 }); // 15 min

    return NextResponse.json(
      {
        uploadUrl,
        key,
        maxFileBytes: MAX_FILE_BYTES,
      },
      { status: 200, headers: corsHeaders() }
    );
  } catch (err) {
    console.error('[presign] Error generating presigned URL:', err);
    return NextResponse.json(
      { error: 'Failed to generate upload URL.' },
      { status: 500, headers: corsHeaders() }
    );
  }
}
