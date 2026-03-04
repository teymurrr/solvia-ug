// Shared email template for all campaign edge functions
// Produces a clean, high-conversion HTML email with styled CTA buttons and professional signature

export type Language = 'es' | 'en' | 'de' | 'fr' | 'ru';

const CALENDLY_URL = 'https://calendly.com/david-rehrl-thesolvia/30min';
const WHATSAPP_URL = 'https://wa.me/4915259018297';

const ctaLabels: Record<Language, { call: string; whatsapp: string }> = {
  es: { call: '📞 Reservar llamada gratuita', whatsapp: '💬 Escríbenos por WhatsApp' },
  en: { call: '📞 Book a Free Call', whatsapp: '💬 Message us on WhatsApp' },
  de: { call: '📞 Kostenloses Gespräch buchen', whatsapp: '💬 Schreib uns auf WhatsApp' },
  fr: { call: '📞 Réserver un appel gratuit', whatsapp: '💬 Écris-nous sur WhatsApp' },
  ru: { call: '📞 Записаться на звонок', whatsapp: '💬 Написать в WhatsApp' },
};

const signatures: Record<Language, string> = {
  es: 'David Rehrl\nDirector de Alianzas de Talento — Solvia',
  en: 'David Rehrl\nHead of Talent Partnerships — Solvia',
  de: 'David Rehrl\nLeiter Talent-Partnerschaften — Solvia',
  fr: 'David Rehrl\nResponsable Partenariats Talents — Solvia',
  ru: 'David Rehrl\nРуководитель партнёрских программ — Solvia',
};

export function generateEmail(greeting: string, body: string, lang: Language): string {
  const cta = ctaLabels[lang];
  const sig = signatures[lang];

  const bodyHtml = body
    .split('\n\n')
    .map(p => `<p style="margin:0 0 16px 0;font-size:16px;line-height:1.7;color:#1a1a1a;">${p.replace(/\n/g, '<br>')}</p>`)
    .join('');

  const sigLines = sig.split('\n');

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:8px;overflow:hidden;">
<tr><td style="padding:40px 40px 0 40px;">
  <p style="margin:0 0 24px 0;font-size:16px;line-height:1.7;color:#1a1a1a;">${greeting}</p>
  ${bodyHtml}
</td></tr>
<tr><td style="padding:8px 40px 32px 40px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
  <tr>
    <td style="padding-right:8px;" width="50%">
      <a href="${CALENDLY_URL}" target="_blank" style="display:block;text-align:center;padding:14px 8px;background-color:#16a34a;color:#ffffff;text-decoration:none;border-radius:6px;font-size:15px;font-weight:600;">${cta.call}</a>
    </td>
    <td style="padding-left:8px;" width="50%">
      <a href="${WHATSAPP_URL}" target="_blank" style="display:block;text-align:center;padding:14px 8px;background-color:#ffffff;color:#16a34a;text-decoration:none;border-radius:6px;font-size:15px;font-weight:600;border:2px solid #16a34a;">${cta.whatsapp}</a>
    </td>
  </tr>
  </table>
</td></tr>
<tr><td style="padding:0 40px;">
  <div style="border-top:1px solid #e4e4e7;"></div>
</td></tr>
<tr><td style="padding:24px 40px 40px 40px;">
  <p style="margin:0;font-size:15px;line-height:1.5;color:#1a1a1a;font-weight:600;">${sigLines[0]}</p>
  ${sigLines[1] ? `<p style="margin:2px 0 0 0;font-size:14px;line-height:1.5;color:#71717a;">${sigLines[1]}</p>` : ''}
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}
