import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface DocumentRequirement {
  id: string;
  country: string;
  document_type: string;
  document_name_en: string;
  document_name_es: string | null;
  document_name_de: string | null;
  document_name_fr: string | null;
  document_name_ru: string | null;
  description_en: string | null;
  description_es: string | null;
  description_de: string | null;
  description_fr: string | null;
  description_ru: string | null;
  instructions_en: string | null;
  instructions_es: string | null;
  instructions_de: string | null;
  instructions_fr: string | null;
  instructions_ru: string | null;
  how_to_obtain_en: string | null;
  how_to_obtain_es: string | null;
  how_to_obtain_de: string | null;
  how_to_obtain_fr: string | null;
  how_to_obtain_ru: string | null;
  estimated_time: string | null;
  estimated_cost: string | null;
  priority_order: number;
  is_required: boolean;
  icon: string | null;
}

export type DocumentStatus = 'not_submitted' | 'pending_review' | 'complete' | 'partial' | 'invalid';

export interface ClientDocument {
  id: string;
  client_id: string;
  requirement_id: string;
  file_path: string | null;
  file_name: string | null;
  file_size: number | null;
  file_type: string | null;
  status: DocumentStatus;
  ai_feedback_en: string | null;
  ai_feedback_es: string | null;
  ai_feedback_de: string | null;
  ai_feedback_fr: string | null;
  ai_feedback_ru: string | null;
  ai_analysis: Record<string, unknown> | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DocumentWithRequirement extends ClientDocument {
  requirement: DocumentRequirement;
}

export const useDocuments = (country: string) => {
  const [requirements, setRequirements] = useState<DocumentRequirement[]>([]);
  const [clientDocuments, setClientDocuments] = useState<ClientDocument[]>([]);
  const [clientId, setClientId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch document requirements for the country
  const fetchRequirements = useCallback(async () => {
    if (!country) return;
    
    const { data, error } = await supabase
      .from('document_requirements')
      .select('*')
      .eq('country', country.toLowerCase())
      .order('priority_order', { ascending: true });

    if (error) {
      console.error('Error fetching requirements:', error);
      return;
    }

    setRequirements(data || []);
  }, [country]);

  // Fetch client and their documents
  const fetchClientDocuments = useCallback(async () => {
    if (!user?.id) return;

    // First get the client record
    const { data: clientData, error: clientError } = await supabase
      .from('clients')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (clientError || !clientData) {
      console.error('Error fetching client:', clientError);
      setLoading(false);
      return;
    }

    setClientId(clientData.id);

    // Then get their documents
    const { data: docsData, error: docsError } = await supabase
      .from('client_documents')
      .select('*')
      .eq('client_id', clientData.id);

    if (docsError) {
      console.error('Error fetching documents:', docsError);
    } else {
      // Cast the status field to our DocumentStatus type
      const typedDocs = (docsData || []).map(doc => ({
        ...doc,
        status: doc.status as DocumentStatus,
        ai_analysis: doc.ai_analysis as Record<string, unknown> | null,
      }));
      setClientDocuments(typedDocs);
    }

    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    fetchRequirements();
    fetchClientDocuments();
  }, [fetchRequirements, fetchClientDocuments]);

  // Upload a document
  const uploadDocument = async (
    requirementId: string,
    file: File,
    language: string = 'en'
  ) => {
    if (!user?.id || !clientId) {
      toast({
        title: 'Error',
        description: 'You must be logged in to upload documents.',
        variant: 'destructive',
      });
      return null;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'Error',
        description: 'File is too large. Maximum size is 10MB.',
        variant: 'destructive',
      });
      return null;
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Error',
        description: 'Invalid file format. Please upload PDF, JPG, or PNG.',
        variant: 'destructive',
      });
      return null;
    }

    setUploading(requirementId);

    try {
      const requirement = requirements.find(r => r.id === requirementId);
      if (!requirement) throw new Error('Requirement not found');

      // Create file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${requirement.document_type}_${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('homologation-documents')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Check if document record exists
      const existingDoc = clientDocuments.find(d => d.requirement_id === requirementId);

      let documentId: string;

      if (existingDoc) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('client_documents')
          .update({
            file_path: filePath,
            file_name: file.name,
            file_size: file.size,
            file_type: file.type,
            status: 'pending_review',
          } as any)
          .eq('id', existingDoc.id);

        if (updateError) throw updateError;
        documentId = existingDoc.id;
      } else {
        // Create new record
        const { data: newDoc, error: insertError } = await supabase
          .from('client_documents')
          .insert({
            client_id: clientId,
            requirement_id: requirementId,
            file_path: filePath,
            file_name: file.name,
            file_size: file.size,
            file_type: file.type,
            status: 'pending_review',
          } as any)
          .select()
          .single();

        if (insertError) throw insertError;
        documentId = newDoc.id;
      }

      // Trigger AI validation
      const { error: validateError } = await supabase.functions.invoke('validate-document', {
        body: {
          documentId,
          requirementId,
          filePath,
          documentType: requirement.document_type,
          language,
        },
      });

      if (validateError) {
        console.error('Validation error:', validateError);
        // Don't fail the upload if validation fails - it can be retried
      }

      // Refresh documents
      await fetchClientDocuments();

      toast({
        title: 'Success',
        description: 'Document uploaded successfully!',
      });

      return documentId;
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload document. Please try again.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setUploading(null);
    }
  };

  // Delete a document
  const deleteDocument = async (documentId: string) => {
    const doc = clientDocuments.find(d => d.id === documentId);
    if (!doc || !doc.file_path) return;

    try {
      // Delete from storage
      await supabase.storage
        .from('homologation-documents')
        .remove([doc.file_path]);

      // Update database record
      await supabase
        .from('client_documents')
        .update({
          file_path: null,
          file_name: null,
          file_size: null,
          file_type: null,
          status: 'not_submitted',
          ai_feedback_en: null,
          ai_feedback_es: null,
          ai_feedback_de: null,
          ai_feedback_fr: null,
          ai_feedback_ru: null,
          ai_analysis: null,
          reviewed_at: null,
        } as any)
        .eq('id', documentId);

      await fetchClientDocuments();

      toast({
        title: 'Success',
        description: 'Document removed.',
      });
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove document.',
        variant: 'destructive',
      });
    }
  };

  // Get document for a requirement
  const getDocumentForRequirement = (requirementId: string): ClientDocument | undefined => {
    return clientDocuments.find(d => d.requirement_id === requirementId);
  };

  // Get combined data
  const getDocumentsWithRequirements = (): DocumentWithRequirement[] => {
    return requirements.map(req => {
      const doc = getDocumentForRequirement(req.id);
      return {
        id: doc?.id || '',
        client_id: clientId || '',
        requirement_id: req.id,
        file_path: doc?.file_path || null,
        file_name: doc?.file_name || null,
        file_size: doc?.file_size || null,
        file_type: doc?.file_type || null,
        status: doc?.status || 'not_submitted',
        ai_feedback_en: doc?.ai_feedback_en || null,
        ai_feedback_es: doc?.ai_feedback_es || null,
        ai_feedback_de: doc?.ai_feedback_de || null,
        ai_feedback_fr: doc?.ai_feedback_fr || null,
        ai_feedback_ru: doc?.ai_feedback_ru || null,
        ai_analysis: doc?.ai_analysis || null,
        reviewed_at: doc?.reviewed_at || null,
        created_at: doc?.created_at || '',
        updated_at: doc?.updated_at || '',
        requirement: req,
      };
    });
  };

  // Calculate progress stats
  const getProgressStats = () => {
    const docs = getDocumentsWithRequirements();
    const total = docs.filter(d => d.requirement.is_required).length;
    const complete = docs.filter(d => d.status === 'complete' && d.requirement.is_required).length;
    const partial = docs.filter(d => d.status === 'partial' && d.requirement.is_required).length;
    const invalid = docs.filter(d => d.status === 'invalid' && d.requirement.is_required).length;
    const notSubmitted = docs.filter(d => (d.status === 'not_submitted' || !d.file_path) && d.requirement.is_required).length;
    const pendingReview = docs.filter(d => d.status === 'pending_review' && d.requirement.is_required).length;
    const uploaded = docs.filter(d => d.file_path && d.requirement.is_required).length;

    return {
      total,
      complete,
      partial,
      invalid,
      notSubmitted,
      pendingReview,
      uploaded,
      percentage: total > 0 ? Math.round((complete / total) * 100) : 0,
    };
  };

  return {
    requirements,
    clientDocuments,
    clientId,
    loading,
    uploading,
    uploadDocument,
    deleteDocument,
    getDocumentForRequirement,
    getDocumentsWithRequirements,
    getProgressStats,
    refetch: fetchClientDocuments,
  };
};
