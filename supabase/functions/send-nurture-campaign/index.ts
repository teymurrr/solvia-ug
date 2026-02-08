import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CampaignRequest {
  segment?: 'hot_leads' | 'germany_beginners' | 'advanced_speakers' | 'cold_leads' | 'all';
  templateId?: 'day0' | 'day1' | 'day3' | 'day5' | 'day7';
  testMode?: boolean; // If true, only sends to one email
  testEmail?: string;
}

interface Lead {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  target_country: string | null;
  study_country: string | null;
  doctor_type: string | null;
  language_level: string | null;
  email_sequence_day: number;
}

// Country name mapping for personalization
const countryNames: Record<string, { es: string; en: string; de: string }> = {
  germany: { es: 'Alemania', en: 'Germany', de: 'Deutschland' },
  spain: { es: 'España', en: 'Spain', de: 'Spanien' },
  austria: { es: 'Austria', en: 'Austria', de: 'Österreich' },
  france: { es: 'Francia', en: 'France', de: 'Frankreich' },
  italy: { es: 'Italia', en: 'Italy', de: 'Italien' },
};

// Profession mapping
const professionNames: Record<string, { es: string; en: string }> = {
  general: { es: 'médico general', en: 'general practitioner' },
  specialist: { es: 'especialista', en: 'specialist' },
  nurse: { es: 'enfermero/a', en: 'nurse' },
  dentist: { es: 'dentista', en: 'dentist' },
  other: { es: 'profesional de la salud', en: 'healthcare professional' },
};

// Get estimated timeline based on language level
const getTimeline = (languageLevel: string | null): string => {
  const level = languageLevel?.toLowerCase() || '';
  if (level.includes('mother') || level.includes('materna') || level.includes('c2')) return '6-9 meses';
  if (level.includes('c1')) return '9-12 meses';
  if (level.includes('b2')) return '12-15 meses';
  if (level.includes('b1')) return '15-18 meses';
  if (level.includes('a2')) return '18-24 meses';
  return '18-24 meses';
};

// Generate personalized email templates
const getEmailTemplate = (templateId: string, lead: Lead, paymentUrl: string) => {
  const firstName = lead.first_name || 'Profesional';
  const country = countryNames[lead.target_country?.toLowerCase() || 'germany']?.es || lead.target_country || 'Europa';
  const profession = professionNames[lead.doctor_type?.toLowerCase() || 'general']?.es || 'médico';
  const studyCountry = lead.study_country || 'tu país';
  const languageLevel = lead.language_level || 'por determinar';
  const timeline = getTimeline(lead.language_level);

  const templates: Record<string, { subject: string; html: string }> = {
    day0: {
      subject: `${firstName}, tu plan para trabajar en ${country} - precio especial €49`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1a1a1a; margin: 0; padding: 0; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #0D9488 0%, #0F766E 100%); padding: 40px 30px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 24px; font-weight: 600; }
    .content { padding: 40px 30px; }
    .situation-box { background: #f0fdfa; border-left: 4px solid #0D9488; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0; }
    .situation-box p { margin: 8px 0; color: #1a1a1a; }
    .cta-button { display: inline-block; background: linear-gradient(135deg, #0D9488 0%, #0F766E 100%); color: white !important; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 18px; margin: 25px 0; }
    .benefits { margin: 25px 0; }
    .benefit { display: flex; align-items: flex-start; margin: 12px 0; }
    .benefit-check { color: #0D9488; font-size: 18px; margin-right: 10px; }
    .urgency { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px 20px; border-radius: 8px; margin: 25px 0; text-align: center; }
    .footer { background: #f8f8f8; padding: 30px; text-align: center; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>¡Hola ${firstName}!</h1>
    </div>
    <div class="content">
      <p>Vi que completaste el análisis para trabajar como <strong>${profession}</strong> en <strong>${country}</strong>.</p>
      
      <div class="situation-box">
        <p><strong>📍 Tu situación actual:</strong></p>
        <p>• País de origen: ${studyCountry}</p>
        <p>• Nivel de idioma: ${languageLevel}</p>
        <p>• Tiempo estimado: ${timeline}</p>
      </div>
      
      <p><strong>La buena noticia:</strong> Miles de médicos latinoamericanos ya ejercen en ${country}. El proceso es claro, solo necesitas el roadmap correcto.</p>
      
      <p>Esta semana, estamos ofreciendo nuestro paquete <strong>Digital Starter</strong> a solo <strong>€49</strong> (precio normal €99) que incluye:</p>
      
      <div class="benefits">
        <div class="benefit"><span class="benefit-check">✓</span> Lista de documentos personalizada para ${studyCountry}</div>
        <div class="benefit"><span class="benefit-check">✓</span> Videos tutoriales paso a paso</div>
        <div class="benefit"><span class="benefit-check">✓</span> Plantillas de formularios oficiales</div>
        <div class="benefit"><span class="benefit-check">✓</span> Soporte por email durante 30 días</div>
      </div>
      
      <div style="text-align: center;">
        <a href="${paymentUrl}" class="cta-button">DESBLOQUEAR MI PLAN - €49</a>
      </div>
      
      <div class="urgency">
        <strong>⏰ Solo 23 spots disponibles a este precio</strong><br>
        Oferta válida hasta el domingo
      </div>
      
      <p>Un abrazo,<br><strong>Equipo Solvia</strong></p>
    </div>
    <div class="footer">
      <p>© 2024 Solvia | <a href="https://solvia-flexkapg.lovable.app">solvia.eu</a></p>
      <p style="font-size: 12px; color: #999;">Si no deseas recibir más emails, responde a este mensaje con "CANCELAR"</p>
    </div>
  </div>
</body>
</html>
      `,
    },
    day1: {
      subject: `Cómo María pasó de México a ${country} en 14 meses`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1a1a1a; margin: 0; padding: 0; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #0D9488 0%, #0F766E 100%); padding: 40px 30px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 24px; font-weight: 600; }
    .content { padding: 40px 30px; }
    .story-box { background: #f8fafc; border-radius: 12px; padding: 25px; margin: 25px 0; }
    .quote { font-style: italic; font-size: 18px; color: #0D9488; border-left: 3px solid #0D9488; padding-left: 20px; margin: 20px 0; }
    .timeline { background: #f0fdfa; padding: 20px; border-radius: 8px; margin: 25px 0; }
    .timeline-item { display: flex; margin: 10px 0; }
    .timeline-month { font-weight: 600; color: #0D9488; min-width: 80px; }
    .cta-button { display: inline-block; background: linear-gradient(135deg, #0D9488 0%, #0F766E 100%); color: white !important; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 18px; margin: 25px 0; }
    .footer { background: #f8f8f8; padding: 30px; text-align: center; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Historia de éxito: De México a ${country}</h1>
    </div>
    <div class="content">
      <p>Hola ${firstName},</p>
      
      <p>Hoy quiero compartirte la historia de María, una médica general de Guadalajara que ahora trabaja en un hospital universitario en ${country}.</p>
      
      <div class="story-box">
        <p><strong>María García, 32 años</strong></p>
        <p>Médica General - Guadalajara, México → ${country}</p>
        
        <div class="quote">
          "Cuando empecé, pensé que tomaría años. Con el plan correcto y la documentación en orden, en 14 meses ya estaba ejerciendo."
        </div>
      </div>
      
      <p><strong>Su timeline:</strong></p>
      
      <div class="timeline">
        <div class="timeline-item"><span class="timeline-month">Mes 1-3:</span> Recopilación de documentos y apostillas</div>
        <div class="timeline-item"><span class="timeline-month">Mes 4-8:</span> Curso intensivo de alemán (A1→B2)</div>
        <div class="timeline-item"><span class="timeline-month">Mes 9-11:</span> Preparación FSP</div>
        <div class="timeline-item"><span class="timeline-month">Mes 12:</span> Examen FSP aprobado ✓</div>
        <div class="timeline-item"><span class="timeline-month">Mes 14:</span> Primer día de trabajo</div>
      </div>
      
      <p>María usó exactamente el mismo plan que ahora ofrecemos en nuestro paquete Digital Starter.</p>
      
      <p><strong>¿Quieres el mismo roadmap que usó María?</strong></p>
      
      <div style="text-align: center;">
        <a href="${paymentUrl}" class="cta-button">VER MI PLAN PERSONALIZADO - €49</a>
      </div>
      
      <p>Un abrazo,<br><strong>Equipo Solvia</strong></p>
    </div>
    <div class="footer">
      <p>© 2024 Solvia | <a href="https://solvia-flexkapg.lovable.app">solvia.eu</a></p>
    </div>
  </div>
</body>
</html>
      `,
    },
    day3: {
      subject: `⚠️ 3 errores que retrasan tu homologación (y cómo evitarlos)`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1a1a1a; margin: 0; padding: 0; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 40px 30px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 24px; font-weight: 600; }
    .content { padding: 40px 30px; }
    .error-box { background: #fef2f2; border-left: 4px solid #dc2626; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0; }
    .error-title { color: #dc2626; font-weight: 600; margin-bottom: 10px; }
    .solution-box { background: #f0fdfa; border-left: 4px solid #0D9488; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0; }
    .solution-title { color: #0D9488; font-weight: 600; margin-bottom: 10px; }
    .cta-button { display: inline-block; background: linear-gradient(135deg, #0D9488 0%, #0F766E 100%); color: white !important; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 18px; margin: 25px 0; }
    .footer { background: #f8f8f8; padding: 30px; text-align: center; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⚠️ 3 Errores Costosos</h1>
    </div>
    <div class="content">
      <p>Hola ${firstName},</p>
      
      <p>Después de ayudar a cientos de médicos con su homologación en ${country}, hemos identificado <strong>3 errores comunes</strong> que pueden retrasar tu proceso hasta 12 meses:</p>
      
      <div class="error-box">
        <p class="error-title">❌ Error #1: Apostillar documentos incorrectamente</p>
        <p>El 40% de los rechazos son por apostillas incorrectas o faltantes. Cada país tiene requisitos específicos que cambian constantemente.</p>
      </div>
      
      <div class="error-box">
        <p class="error-title">❌ Error #2: No validar traducciones antes de enviar</p>
        <p>Una traducción rechazada significa 2-3 meses perdidos. Las traducciones deben seguir formatos específicos para cada Landesärztekammer.</p>
      </div>
      
      <div class="error-box">
        <p class="error-title">❌ Error #3: Empezar el idioma sin un plan estructurado</p>
        <p>Muchos gastan €2,000+ en cursos que no los preparan para el B2 médico o el FSP. El orden y el enfoque importan.</p>
      </div>
      
      <div class="solution-box">
        <p class="solution-title">✅ La solución</p>
        <p>Nuestro paquete Digital Starter incluye:</p>
        <ul>
          <li>Checklist de apostillas específico para ${studyCountry}</li>
          <li>Plantillas de traducción pre-validadas</li>
          <li>Plan de estudio de idioma optimizado</li>
        </ul>
      </div>
      
      <div style="text-align: center;">
        <a href="${paymentUrl}" class="cta-button">EVITAR ESTOS ERRORES - €49</a>
      </div>
      
      <p>Un abrazo,<br><strong>Equipo Solvia</strong></p>
    </div>
    <div class="footer">
      <p>© 2024 Solvia | <a href="https://solvia-flexkapg.lovable.app">solvia.eu</a></p>
    </div>
  </div>
</body>
</html>
      `,
    },
    day5: {
      subject: `${firstName}, el precio sube en 48 horas ⏰`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1a1a1a; margin: 0; padding: 0; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px 30px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 24px; font-weight: 600; }
    .content { padding: 40px 30px; }
    .countdown { background: #1a1a1a; color: white; padding: 25px; border-radius: 12px; text-align: center; margin: 25px 0; }
    .countdown-time { font-size: 36px; font-weight: 700; color: #f59e0b; }
    .price-compare { display: flex; justify-content: center; gap: 30px; margin: 25px 0; text-align: center; }
    .price-old { color: #999; text-decoration: line-through; font-size: 24px; }
    .price-new { color: #0D9488; font-size: 36px; font-weight: 700; }
    .cta-button { display: inline-block; background: linear-gradient(135deg, #0D9488 0%, #0F766E 100%); color: white !important; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 18px; margin: 25px 0; }
    .footer { background: #f8f8f8; padding: 30px; text-align: center; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⏰ Última oportunidad</h1>
    </div>
    <div class="content">
      <p>Hola ${firstName},</p>
      
      <p>Esta es la última vez que verás el paquete Digital Starter a <strong>€49</strong>.</p>
      
      <div class="countdown">
        <p style="margin: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">El precio sube en</p>
        <p class="countdown-time">48 HORAS</p>
        <p style="margin: 0; font-size: 14px;">El domingo a medianoche vuelve a €99</p>
      </div>
      
      <p>Tu timeline para ${country}:</p>
      <ul>
        <li>Tiempo estimado: <strong>${timeline}</strong></li>
        <li>Inversión total estimada: <strong>€3,000-5,000</strong> (idioma + trámites)</li>
        <li>Salario promedio en ${country}: <strong>€60,000-80,000/año</strong></li>
      </ul>
      
      <p>Por <strong>€49</strong>, obtienes el roadmap exacto que te ahorrará meses de investigación y miles de euros en errores.</p>
      
      <div class="price-compare">
        <div>
          <p style="margin: 0; font-size: 12px; color: #666;">DESPUÉS</p>
          <p class="price-old">€99</p>
        </div>
        <div>
          <p style="margin: 0; font-size: 12px; color: #666;">AHORA</p>
          <p class="price-new">€49</p>
        </div>
      </div>
      
      <div style="text-align: center;">
        <a href="${paymentUrl}" class="cta-button">ASEGURAR PRECIO €49</a>
      </div>
      
      <p>Un abrazo,<br><strong>Equipo Solvia</strong></p>
    </div>
    <div class="footer">
      <p>© 2024 Solvia | <a href="https://solvia-flexkapg.lovable.app">solvia.eu</a></p>
    </div>
  </div>
</body>
</html>
      `,
    },
    day7: {
      subject: `🎁 Último día: €49 + Consulta GRATIS`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1a1a1a; margin: 0; padding: 0; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #0D9488 0%, #0F766E 100%); padding: 40px 30px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 24px; font-weight: 600; }
    .content { padding: 40px 30px; }
    .bonus-box { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 2px solid #f59e0b; padding: 25px; border-radius: 12px; margin: 25px 0; text-align: center; }
    .bonus-title { font-size: 20px; font-weight: 700; color: #92400e; margin-bottom: 10px; }
    .final-offer { background: #0D9488; color: white; padding: 30px; border-radius: 12px; text-align: center; margin: 25px 0; }
    .final-price { font-size: 48px; font-weight: 700; }
    .cta-button { display: inline-block; background: white; color: #0D9488 !important; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 18px; margin: 15px 0; }
    .guarantee { background: #f0fdfa; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center; }
    .footer { background: #f8f8f8; padding: 30px; text-align: center; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎁 Oferta Final</h1>
    </div>
    <div class="content">
      <p>Hola ${firstName},</p>
      
      <p>Este es el <strong>último email</strong> que te envío sobre esta oferta.</p>
      
      <p>Hoy a medianoche, el precio vuelve a €99. Pero antes de que eso pase, quiero añadir algo especial:</p>
      
      <div class="bonus-box">
        <p class="bonus-title">🎁 BONUS: Consulta 1:1 GRATIS</p>
        <p>Solo para quienes compren HOY: Una llamada de 30 minutos conmigo para revisar tu caso específico.</p>
        <p style="font-size: 14px; color: #666;">Valor: €50 → Hoy: GRATIS</p>
      </div>
      
      <div class="final-offer">
        <p style="margin: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Última oportunidad</p>
        <p class="final-price">€49</p>
        <p style="margin: 10px 0;">Digital Starter + Consulta 1:1 incluida</p>
        <a href="${paymentUrl}" class="cta-button">COMPRAR AHORA</a>
        <p style="font-size: 12px; margin-top: 15px; opacity: 0.9;">Oferta termina a medianoche</p>
      </div>
      
      <div class="guarantee">
        <p><strong>🛡️ Garantía 30 días</strong></p>
        <p style="margin: 0; font-size: 14px;">Si no te es útil, te devolvemos el 100% de tu dinero. Sin preguntas.</p>
      </div>
      
      <p>Gracias por considerar Solvia. Espero poder ayudarte en tu camino a ${country}.</p>
      
      <p>Un abrazo,<br><strong>Equipo Solvia</strong></p>
    </div>
    <div class="footer">
      <p>© 2024 Solvia | <a href="https://solvia-flexkapg.lovable.app">solvia.eu</a></p>
    </div>
  </div>
</body>
</html>
      `,
    },
  };

  return templates[templateId] || templates.day0;
};

// Segment leads based on criteria
const segmentLeads = (leads: Lead[], segment: string): Lead[] => {
  switch (segment) {
    case 'hot_leads':
      // Native speakers going to Spain (easiest conversion)
      return leads.filter(l => {
        const lang = l.language_level?.toLowerCase() || '';
        const country = l.target_country?.toLowerCase() || '';
        return (lang.includes('materna') || lang.includes('mother') || lang.includes('nativ')) && 
               (country === 'spain' || country === 'españa');
      });
    
    case 'germany_beginners':
      // Germany-bound with A1/A2 level
      return leads.filter(l => {
        const lang = l.language_level?.toLowerCase() || '';
        const country = l.target_country?.toLowerCase() || '';
        return (country === 'germany' || country === 'alemania' || country === 'deutschland') &&
               (lang.includes('a1') || lang.includes('a2') || lang === '');
      });
    
    case 'advanced_speakers':
      // B2/C1 speakers going to Germany
      return leads.filter(l => {
        const lang = l.language_level?.toLowerCase() || '';
        const country = l.target_country?.toLowerCase() || '';
        return (country === 'germany' || country === 'alemania' || country === 'deutschland') &&
               (lang.includes('b2') || lang.includes('c1'));
      });
    
    case 'cold_leads':
      // Everyone else
      return leads;
    
    case 'all':
    default:
      return leads;
  }
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { segment = 'all', templateId = 'day0', testMode = false, testEmail }: CampaignRequest = await req.json();

    console.log(`📧 Starting nurture campaign - Segment: ${segment}, Template: ${templateId}, TestMode: ${testMode}`);

    // Fetch all leads from the leads table
    const { data: leadsData, error: leadsError } = await supabase
      .from('leads')
      .select('id, email, first_name, last_name, target_country, study_country, doctor_type, language_level, email_sequence_day')
      .eq('converted', false);

    if (leadsError) {
      console.error('Error fetching leads:', leadsError);
      throw new Error(`Failed to fetch leads: ${leadsError.message}`);
    }

    let leads = leadsData as Lead[];
    console.log(`📊 Found ${leads.length} unconverted leads`);

    // Apply segmentation
    leads = segmentLeads(leads, segment);
    console.log(`📊 After segmentation (${segment}): ${leads.length} leads`);

    // In test mode, only send to one email
    if (testMode) {
      if (testEmail) {
        leads = leads.filter(l => l.email.toLowerCase() === testEmail.toLowerCase());
      } else {
        leads = leads.slice(0, 1);
      }
      console.log(`🧪 Test mode: sending to ${leads.length} leads`);
    }

    const paymentBaseUrl = 'https://solvia-flexkapg.lovable.app/homologation-payment';
    const results = {
      sent: 0,
      failed: 0,
      skipped: 0,
      errors: [] as string[],
    };

    for (const lead of leads) {
      try {
        // Build personalized payment URL with lead data
        const paymentUrl = `${paymentBaseUrl}?email=${encodeURIComponent(lead.email)}&country=${encodeURIComponent(lead.target_country || 'germany')}`;
        
        const template = getEmailTemplate(templateId, lead, paymentUrl);

        const emailResponse = await resend.emails.send({
          from: "Solvia <hello@solvia.eu>",
          to: [lead.email],
          subject: template.subject,
          html: template.html,
        });

        console.log(`✅ Email sent to ${lead.email}:`, emailResponse);

        // Update lead tracking
        const dayNumber = parseInt(templateId.replace('day', ''));
        await supabase
          .from('leads')
          .update({
            email_sequence_day: dayNumber,
            last_email_sent: new Date().toISOString(),
            email_campaign: `nurture_${segment}_${templateId}`,
          })
          .eq('id', lead.id);

        results.sent++;
      } catch (emailError: any) {
        console.error(`❌ Failed to send to ${lead.email}:`, emailError);
        results.failed++;
        results.errors.push(`${lead.email}: ${emailError.message}`);
      }
    }

    console.log(`📧 Campaign complete:`, results);

    return new Response(
      JSON.stringify({
        success: true,
        campaign: `${segment}_${templateId}`,
        results,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("❌ Campaign error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
