// Shared Brevo (Sendinblue) email client for campaign/marketing edge functions
// Replaces Resend for all marketing/campaign emails

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

interface BrevoEmailOptions {
  from: { name: string; email: string };
  to: string[];
  subject: string;
  html?: string;
  text?: string;
  replyTo?: string;
}

interface BrevoResponse {
  messageId?: string;
}

export async function sendBrevoEmail(options: BrevoEmailOptions): Promise<BrevoResponse> {
  const apiKey = Deno.env.get('BREVO_API_KEY');
  if (!apiKey) {
    throw new Error('BREVO_API_KEY is not configured');
  }

  const body: Record<string, unknown> = {
    sender: { name: options.from.name, email: options.from.email },
    to: options.to.map(email => ({ email })),
    subject: options.subject,
  };

  if (options.html) body.htmlContent = options.html;
  if (options.text) body.textContent = options.text;
  if (options.replyTo) body.replyTo = { email: options.replyTo };

  const response = await fetch(BREVO_API_URL, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': apiKey,
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Brevo API error [${response.status}]: ${errorText}`);
  }

  const data = await response.json();
  return { messageId: data.messageId || null };
}
