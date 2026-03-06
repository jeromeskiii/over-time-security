import { Resend } from 'resend';

let resendClient: Resend | null = null;

function getResendClient(): Resend {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('[Email] RESEND_API_KEY environment variable is not set');
    }
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType?: string;
  }>;
}

/**
 * Send an email via Resend.
 * Returns the message ID on success, throws on failure.
 */
export async function sendEmail(options: EmailOptions): Promise<string> {
  const client = getResendClient();
  const fromAddress = options.from ?? process.env.EMAIL_FROM ?? 'Over Time Security <noreply@overtimesecurity.com>';

  const { data, error } = await client.emails.send({
    from: fromAddress,
    to: Array.isArray(options.to) ? options.to : [options.to],
    subject: options.subject,
    html: options.html,
    replyTo: options.replyTo,
    attachments: options.attachments?.map((a) => ({
      filename: a.filename,
      content: a.content,
      content_type: a.contentType,
    })),
  });

  if (error) {
    throw new Error(`[Email] Send failed: ${error.message}`);
  }

  return data?.id ?? 'unknown';
}
