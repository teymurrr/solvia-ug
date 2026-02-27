import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LeadData {
  email: string;
  firstName?: string;
  lastName?: string;
  targetCountry?: string;
  studyCountry?: string;
  doctorType?: string;
  languageLevel?: string;
  source?: string;
  browserLanguage?: string;
  uiLanguage?: string; // The language the user is actively using in the UI
}

// Study country → language mapping (most reliable signal)
const spanishCountries = [
  'mexico', 'méxico', 'colombia', 'chile', 'peru', 'perú', 'bolivia',
  'venezuela', 'cuba', 'argentina', 'ecuador', 'uruguay', 'paraguay',
  'panama', 'panamá', 'costa rica', 'guatemala', 'honduras', 'el salvador',
  'nicaragua', 'dominican republic', 'república dominicana', 'puerto rico',
  'spain', 'españa',
];
const germanCountries = ['germany', 'deutschland', 'austria', 'österreich', 'switzerland', 'schweiz'];
const frenchCountries = ['france', 'belgium', 'belgique', 'tunisia', 'tunisie', 'morocco', 'maroc', 'algeria', 'algérie', 'senegal', 'cameroon'];
const russianCountries = ['russia', 'ukraine', 'belarus', 'kazakhstan', 'uzbekistan'];

function detectLanguageFromCountry(country: string | undefined): string | null {
  if (!country) return null;
  const c = country.toLowerCase().trim();
  if (spanishCountries.some(sc => c.includes(sc))) return 'es';
  if (germanCountries.some(gc => c.includes(gc))) return 'de';
  if (frenchCountries.some(fc => c.includes(fc))) return 'fr';
  if (russianCountries.some(rc => c.includes(rc))) return 'ru';
  return null;
}

const supportedLangs = ['es', 'de', 'en', 'fr', 'ru'];

/**
 * Language detection priority:
 * 1. UI language (the language the user chose in the app — strongest signal)
 * 2. Study country mapping (where they studied medicine — very reliable)
 * 3. Browser language (decent but many Spanish speakers use English browsers)
 * 4. Email TLD (weak signal, last resort)
 * 5. Default: 'en'
 */
function detectBestLanguage(data: LeadData): string {
  // 1. UI language — user actively chose this
  if (data.uiLanguage) {
    const ui = data.uiLanguage.toLowerCase().split('-')[0];
    if (supportedLangs.includes(ui)) return ui;
  }

  // 2. Study country — extremely reliable for native language
  const fromCountry = detectLanguageFromCountry(data.studyCountry);
  if (fromCountry) return fromCountry;

  // 3. Browser language
  if (data.browserLanguage) {
    const browser = data.browserLanguage.toLowerCase().split('-')[0];
    if (supportedLangs.includes(browser)) return browser;
  }

  // 4. Email TLD
  if (data.email) {
    const domain = data.email.toLowerCase().split('@')[1] || '';
    if (['.es', '.mx', '.co', '.ar', '.cl', '.pe', '.ve', '.ec', '.cu', '.uy'].some(tld => domain.endsWith(tld))) return 'es';
    if (['.de', '.at', '.ch'].some(tld => domain.endsWith(tld))) return 'de';
    if (['.fr', '.be'].some(tld => domain.endsWith(tld))) return 'fr';
    if (['.ru', '.by', '.kz', '.uz'].some(tld => domain.endsWith(tld))) return 'ru';
  }

  return 'en';
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body: LeadData = await req.json();
    
    if (!body.email || !body.email.includes('@')) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const email = body.email.toLowerCase().trim();
    const detectedLanguage = detectBestLanguage({ ...body, email });
    
    console.log(`Capturing lead: ${email} | detected language: ${detectedLanguage} | uiLang: ${body.uiLanguage} | studyCountry: ${body.studyCountry} | browserLang: ${body.browserLanguage}`);

    // Check if lead already exists
    const { data: existingLead } = await supabase
      .from('leads')
      .select('id, preferred_language')
      .eq('email', email)
      .single();

    if (existingLead) {
      const updateData: Record<string, any> = {
        first_name: body.firstName || undefined,
        last_name: body.lastName || undefined,
        target_country: body.targetCountry || undefined,
        study_country: body.studyCountry || undefined,
        doctor_type: body.doctorType || undefined,
        language_level: body.languageLevel || undefined,
        source: body.source || 'wizard',
        updated_at: new Date().toISOString(),
      };
      
      // Always update preferred_language with our improved detection
      // (overwrite even if set, since the new detection is more accurate)
      updateData.preferred_language = detectedLanguage;
      
      const { error: updateError } = await supabase
        .from('leads')
        .update(updateData)
        .eq('id', existingLead.id);

      if (updateError) {
        console.error('Error updating lead:', updateError);
        throw updateError;
      }

      console.log(`Updated existing lead: ${email} → lang: ${detectedLanguage}`);
      return new Response(
        JSON.stringify({ success: true, action: 'updated', language: detectedLanguage }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      const { error: insertError } = await supabase
        .from('leads')
        .insert({
          email,
          first_name: body.firstName || null,
          last_name: body.lastName || null,
          target_country: body.targetCountry || null,
          study_country: body.studyCountry || null,
          doctor_type: body.doctorType || null,
          language_level: body.languageLevel || null,
          source: body.source || 'wizard',
          preferred_language: detectedLanguage,
        });

      if (insertError) {
        console.error('Error inserting lead:', insertError);
        throw insertError;
      }

      console.log(`Created new lead: ${email} → lang: ${detectedLanguage}`);
      return new Response(
        JSON.stringify({ success: true, action: 'created', language: detectedLanguage }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Lead capture error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to capture lead' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
