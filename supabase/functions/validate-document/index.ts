import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Fixed: Use chunked approach to avoid stack overflow with large files
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunkSize = 0x8000; // 32KB chunks to avoid stack overflow
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));
    binary += String.fromCharCode(...chunk);
  }
  return btoa(binary);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { documentId, requirementId, filePath, documentType, language = 'en' } = await req.json();
    
    console.log('Validating document:', { documentId, requirementId, filePath, documentType, language });

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the document requirement details
    const { data: requirement, error: reqError } = await supabase
      .from('document_requirements')
      .select('*')
      .eq('id', requirementId)
      .single();

    if (reqError || !requirement) {
      console.error('Requirement fetch error:', reqError);
      throw new Error('Document requirement not found');
    }

    // Download the file from storage
    console.log('Downloading file from storage:', filePath);
    const { data: fileData, error: downloadError } = await supabase
      .storage
      .from('homologation-documents')
      .download(filePath);

    if (downloadError || !fileData) {
      console.error('Download error:', downloadError);
      throw new Error('Failed to download document');
    }

    console.log('File downloaded, size:', fileData.size, 'bytes');

    // Convert file to base64 for AI analysis using chunked approach
    const arrayBuffer = await fileData.arrayBuffer();
    console.log('Converting to base64...');
    const base64 = arrayBufferToBase64(arrayBuffer);
    console.log('Base64 conversion complete, length:', base64.length);
    
    // Determine file type for the AI
    const fileExtension = filePath.split('.').pop()?.toLowerCase();
    const mimeType = fileExtension === 'pdf' ? 'application/pdf' : 
                     fileExtension === 'png' ? 'image/png' :
                     fileExtension === 'jpg' || fileExtension === 'jpeg' ? 'image/jpeg' :
                     'application/octet-stream';

    // Create the prompt for document analysis
    const documentName = requirement[`document_name_${language}`] || requirement.document_name_en;
    const instructions = requirement[`instructions_${language}`] || requirement.instructions_en;

    const systemPrompt = `You are an expert document validator for medical professional homologation processes. Your task is to analyze uploaded documents and determine if they meet the requirements.

You must respond in JSON format with the following structure:
{
  "status": "complete" | "partial" | "invalid",
  "confidence": 0.0-1.0,
  "feedback": {
    "en": "English feedback",
    "es": "Spanish feedback",
    "de": "German feedback",
    "fr": "French feedback",
    "ru": "Russian feedback"
  },
  "issues": ["list of specific issues found"],
  "suggestions": ["list of suggestions to fix issues"]
}

Status meanings:
- "complete": Document is valid, properly formatted, and contains all required information
- "partial": Document is the correct type but missing some information or has quality issues
- "invalid": Wrong document type, illegible, or doesn't meet requirements

Be helpful and specific in your feedback. Provide actionable suggestions.`;

    const userPrompt = `Please analyze this document for the following requirement:

Document Type: ${documentType}
Document Name: ${documentName}
Requirements: ${instructions}

Analyze if this document:
1. Is the correct document type (${documentType})
2. Is legible and clear
3. Contains all required information
4. Is properly formatted/certified if needed

Provide your analysis in the specified JSON format.`;

    // Call Lovable AI Gateway with vision
    console.log('Calling AI Gateway for analysis...');
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { 
            role: 'user', 
            content: [
              { type: 'text', text: userPrompt },
              { 
                type: 'image_url', 
                image_url: { 
                  url: `data:${mimeType};base64,${base64}` 
                } 
              }
            ]
          }
        ],
        max_tokens: 2000,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI Gateway error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ 
          error: 'Rate limit exceeded. Please try again in a moment.',
          status: 'pending_review'
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ 
          error: 'Service temporarily unavailable. Please try again later.',
          status: 'pending_review'
        }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(`AI analysis failed: ${aiResponse.status} - ${errorText}`);
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices?.[0]?.message?.content;
    
    console.log('AI response received:', aiContent?.substring(0, 200));

    // Parse the AI response
    let analysis;
    try {
      // Try to extract JSON from the response
      const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
        console.log('Parsed analysis status:', analysis.status);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Default to pending review if parsing fails
      analysis = {
        status: 'pending_review',
        confidence: 0,
        feedback: {
          en: 'Document uploaded successfully. Manual review required.',
          es: 'Documento subido exitosamente. Se requiere revisión manual.',
          de: 'Dokument erfolgreich hochgeladen. Manuelle Überprüfung erforderlich.',
          fr: 'Document téléchargé avec succès. Révision manuelle requise.',
          ru: 'Документ успешно загружен. Требуется ручная проверка.'
        },
        issues: [],
        suggestions: []
      };
    }

    // Update the client_documents record with the analysis
    console.log('Updating document record with analysis...');
    const { error: updateError } = await supabase
      .from('client_documents')
      .update({
        status: analysis.status,
        ai_feedback_en: analysis.feedback?.en || null,
        ai_feedback_es: analysis.feedback?.es || null,
        ai_feedback_de: analysis.feedback?.de || null,
        ai_feedback_fr: analysis.feedback?.fr || null,
        ai_feedback_ru: analysis.feedback?.ru || null,
        ai_analysis: analysis,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', documentId);

    if (updateError) {
      console.error('Update error:', updateError);
      throw new Error('Failed to update document status');
    }

    console.log('Document validation complete:', documentId, 'Status:', analysis.status);

    return new Response(JSON.stringify({ 
      success: true,
      analysis 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in validate-document:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 'pending_review'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
