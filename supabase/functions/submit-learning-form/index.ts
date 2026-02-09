
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LearningFormData {
  fullName: string;
  country: string;
  email: string;
  profession: string;
  germanLanguage: boolean;
  fspPreparation: boolean;
  language?: string;
}

// Language detection from country and email
const spanishCountries = ['mexico', 'méxico', 'colombia', 'chile', 'peru', 'perú', 'bolivia', 'venezuela', 'cuba', 'argentina', 'ecuador', 'uruguay', 'paraguay', 'panama', 'panamá', 'costa rica', 'guatemala', 'honduras', 'el salvador', 'nicaragua', 'dominican republic', 'república dominicana', 'puerto rico', 'spain', 'españa'];
const germanCountries = ['germany', 'deutschland', 'austria', 'österreich', 'switzerland', 'schweiz'];
const frenchCountries = ['france', 'belgium', 'belgique', 'morocco', 'algeria', 'tunisia'];
const russianCountries = ['russia', 'ukraine', 'belarus', 'kazakhstan', 'uzbekistan'];

const spanishTLDs = ['.es', '.ar', '.mx', '.co', '.cl', '.pe', '.ve', '.ec', '.uy', '.py', '.bo', '.cr', '.gt', '.hn', '.sv', '.ni', '.pa', '.do', '.cu'];
const germanTLDs = ['.de', '.at', '.ch'];
const frenchTLDs = ['.fr', '.be'];
const russianTLDs = ['.ru', '.by', '.kz', '.uz'];

const detectLanguage = (country: string, email: string, explicitLang?: string): string => {
  if (explicitLang && ['es', 'de', 'fr', 'ru', 'en'].includes(explicitLang)) return explicitLang;
  
  const c = country.toLowerCase();
  if (spanishCountries.some(sc => c.includes(sc))) return 'es';
  if (germanCountries.some(sc => c.includes(sc))) return 'de';
  if (frenchCountries.some(sc => c.includes(sc))) return 'fr';
  if (russianCountries.some(sc => c.includes(sc))) return 'ru';

  const domain = email.toLowerCase().split('@')[1] || '';
  if (spanishTLDs.some(tld => domain.endsWith(tld))) return 'es';
  if (germanTLDs.some(tld => domain.endsWith(tld))) return 'de';
  if (frenchTLDs.some(tld => domain.endsWith(tld))) return 'fr';
  if (russianTLDs.some(tld => domain.endsWith(tld))) return 'ru';

  return 'en';
};

const getConfirmationEmail = (formData: LearningFormData, lang: string) => {
  const subjects: Record<string, string> = {
    es: 'Gracias por tu interés en Solvia Learning',
    en: 'Thank you for your interest in Solvia Learning',
    de: 'Vielen Dank für Ihr Interesse an Solvia Learning',
    fr: 'Merci pour votre intérêt pour Solvia Learning',
    ru: 'Спасибо за интерес к Solvia Learning',
  };

  const greetings: Record<string, string> = {
    es: `¡Gracias por tu interés, ${formData.fullName}!`,
    en: `Thank you for your interest, ${formData.fullName}!`,
    de: `Vielen Dank für Ihr Interesse, ${formData.fullName}!`,
    fr: `Merci pour votre intérêt, ${formData.fullName}!`,
    ru: `Спасибо за ваш интерес, ${formData.fullName}!`,
  };

  const bodyText: Record<string, string> = {
    es: 'Hemos recibido tu información y nos pondremos en contacto contigo pronto con detalles sobre nuestros cursos.',
    en: 'We have received your information and will get back to you soon with details about our courses.',
    de: 'Wir haben Ihre Informationen erhalten und werden uns in Kürze mit Details zu unseren Kursen bei Ihnen melden.',
    fr: 'Nous avons reçu vos informations et vous contacterons bientôt avec les détails de nos cours.',
    ru: 'Мы получили вашу информацию и свяжемся с вами в ближайшее время с подробностями о наших курсах.',
  };

  const detailsTitle: Record<string, string> = {
    es: 'Detalles de tu solicitud:',
    en: 'Your submission details:',
    de: 'Ihre Angaben:',
    fr: 'Détails de votre demande:',
    ru: 'Детали вашей заявки:',
  };

  const labels: Record<string, { country: string; profession: string; german: string; fsp: string; yes: string; no: string }> = {
    es: { country: 'País', profession: 'Profesión', german: 'Cursos de idioma médico', fsp: 'Preparación FSP', yes: 'Sí', no: 'No' },
    en: { country: 'Country', profession: 'Profession', german: 'Medical Language Courses', fsp: 'FSP Preparation', yes: 'Yes', no: 'No' },
    de: { country: 'Land', profession: 'Beruf', german: 'Medizinische Sprachkurse', fsp: 'FSP-Vorbereitung', yes: 'Ja', no: 'Nein' },
    fr: { country: 'Pays', profession: 'Profession', german: 'Cours de langue médicale', fsp: 'Préparation FSP', yes: 'Oui', no: 'Non' },
    ru: { country: 'Страна', profession: 'Профессия', german: 'Курсы медицинского языка', fsp: 'Подготовка к FSP', yes: 'Да', no: 'Нет' },
  };

  const closing: Record<string, string> = {
    es: 'Saludos cordiales,<br>El equipo de Solvia Learning',
    en: 'Best regards,<br>The Solvia Learning Team',
    de: 'Mit freundlichen Grüßen,<br>Das Solvia Learning Team',
    fr: 'Cordialement,<br>L\'équipe Solvia Learning',
    ru: 'С уважением,<br>Команда Solvia Learning',
  };

  const l = labels[lang] || labels.en;

  return {
    subject: subjects[lang] || subjects.en,
    html: `
      <h1>${greetings[lang] || greetings.en}</h1>
      <p>${bodyText[lang] || bodyText.en}</p>
      <h3>${detailsTitle[lang] || detailsTitle.en}</h3>
      <ul>
        <li><strong>${l.country}:</strong> ${formData.country}</li>
        <li><strong>${l.profession}:</strong> ${formData.profession}</li>
        <li><strong>${l.german}:</strong> ${formData.germanLanguage ? l.yes : l.no}</li>
        <li><strong>${l.fsp}:</strong> ${formData.fspPreparation ? l.yes : l.no}</li>
      </ul>
      <p>${closing[lang] || closing.en}</p>
    `,
  };
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405, 
      headers: corsHeaders 
    });
  }

  try {
    const formData: LearningFormData = await req.json();
    console.log('Received form submission:', formData);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Detect language
    const lang = detectLanguage(formData.country, formData.email, formData.language);

    // Save form submission to database
    const { data, error } = await supabase
      .from('learning_form_submissions')
      .insert({
        full_name: formData.fullName,
        country: formData.country,
        email: formData.email,
        profession: formData.profession,
        german_language: formData.germanLanguage,
        fsp_preparation: formData.fspPreparation,
        preferred_language: lang,
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      throw new Error('Failed to save form submission');
    }

    console.log('Form submission saved successfully:', data);

    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

    // Send notification email to admin
    const adminEmailResponse = await resend.emails.send({
      from: "Solvia Learning <team@thesolvia.com>",
      to: ["david.rehrl@thesolvia.com"],
      subject: `New Learning Form Submission (${lang.toUpperCase()})`,
      html: `
        <h2>New Learning Form Submission</h2>
        <p><strong>Name:</strong> ${formData.fullName}</p>
        <p><strong>Country:</strong> ${formData.country}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Profession:</strong> ${formData.profession}</p>
        <p><strong>Language Detected:</strong> ${lang}</p>
        <p><strong>Interested in German Language:</strong> ${formData.germanLanguage ? 'Yes' : 'No'}</p>
        <p><strong>Interested in FSP Preparation:</strong> ${formData.fspPreparation ? 'Yes' : 'No'}</p>
        <p><strong>Submitted at:</strong> ${new Date().toLocaleString()}</p>
      `,
    });

    // Send localized confirmation email to user
    const { subject, html } = getConfirmationEmail(formData, lang);
    const userEmailResponse = await resend.emails.send({
      from: "Solvia Learning <team@thesolvia.com>",
      to: [formData.email],
      subject,
      html,
    });

    console.log("Admin email sent:", adminEmailResponse);
    console.log("User confirmation email sent:", userEmailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Form submitted successfully',
        submissionId: data.id 
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );

  } catch (error: any) {
    console.error('Error in submit-learning-form function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Internal server error' 
      }),
      {
        status: 500,
        headers: { 
          'Content-Type': 'application/json', 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);
