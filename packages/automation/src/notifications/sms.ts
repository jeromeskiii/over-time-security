// eslint-disable-next-line @typescript-eslint/no-explicit-any
let twilioClient: any = null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getTwilioClient(): any {
  if (!twilioClient) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    if (!accountSid || !authToken) {
      throw new Error('[SMS] TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN must be set');
    }
    // Dynamic import to avoid loading Twilio when not needed
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const twilio = require('twilio');
    twilioClient = twilio(accountSid, authToken);
  }
  return twilioClient;
}

export interface SMSOptions {
  to: string;
  body: string;
  from?: string;
}

/**
 * Send an SMS via Twilio.
 * Returns the message SID on success, throws on failure.
 */
export async function sendSMS(options: SMSOptions): Promise<string> {
  const client = getTwilioClient();
  const fromNumber = options.from ?? process.env.TWILIO_PHONE_NUMBER;

  if (!fromNumber) {
    throw new Error('[SMS] TWILIO_PHONE_NUMBER environment variable is not set');
  }

  const message = await client.messages.create({
    to: options.to,
    from: fromNumber,
    body: options.body,
  });

  return message.sid;
}
