import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, MessageCircle, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/contexts/AuthContext';
import { useDocuments } from '@/hooks/useDocuments';
import { DocumentStatusCard } from '@/components/documents/DocumentStatusCard';
import { ProgressOverview } from '@/components/documents/ProgressOverview';
import { supabase } from '@/integrations/supabase/client';
import MainLayout from '@/components/MainLayout';

const DocumentStatus: React.FC = () => {
  const navigate = useNavigate();
  const { t, currentLanguage } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const [clientData, setClientData] = useState<{ target_country: string; federal_state: string | null } | null>(null);
  const [loadingClient, setLoadingClient] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingForReq, setUploadingForReq] = useState<string | null>(null);

  const docs = t.documents as any;
  const countryKey = clientData?.target_country?.toLowerCase() || 'germany';

  const {
    loading: docsLoading,
    uploadDocument,
    retryValidation,
    getDocumentsWithRequirements,
    getProgressStats,
    getDocumentPreviewUrl,
  } = useDocuments(countryKey);

  // Fetch client data
  useEffect(() => {
    const fetchClientData = async () => {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from('clients')
        .select('target_country, federal_state')
        .eq('user_id', user.id)
        .single();

      if (error || !data?.target_country) {
        navigate('/onboarding');
        return;
      }

      setClientData(data);
      setLoadingClient(false);
    };

    if (!authLoading) {
      if (!user) {
        navigate('/login');
      } else {
        fetchClientData();
      }
    }
  }, [user, authLoading, navigate]);

  const stats = getProgressStats();
  const documentsWithRequirements = getDocumentsWithRequirements();

  const getCountryName = () => {
    const countryNames: Record<string, string> = {
      germany: docs?.countries?.germany || 'Germany',
      austria: docs?.countries?.austria || 'Austria',
      spain: docs?.countries?.spain || 'Spain',
      italy: docs?.countries?.italy || 'Italy',
      france: docs?.countries?.france || 'France',
    };
    return countryNames[countryKey] || countryKey;
  };

  const handleReupload = (requirementId: string) => {
    setUploadingForReq(requirementId);
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && uploadingForReq) {
      await uploadDocument(uploadingForReq, file, currentLanguage);
    }
    e.target.value = '';
    setUploadingForReq(null);
  };

  const handlePreview = async (filePath: string | null) => {
    if (!filePath) return;
    const url = await getDocumentPreviewUrl(filePath);
    if (url) {
      window.open(url, '_blank');
    }
  };

  if (authLoading || loadingClient || docsLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  // Group documents by status
  const needsAttention = documentsWithRequirements.filter(
    d => d.status === 'partial' || d.status === 'invalid'
  );
  const complete = documentsWithRequirements.filter(d => d.status === 'complete');
  const pending = documentsWithRequirements.filter(d => d.status === 'pending_review');
  const notSubmitted = documentsWithRequirements.filter(
    d => d.status === 'not_submitted' || !d.file_path
  );

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              {docs?.status?.title}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {docs?.status?.subtitle}
            </p>
            <div className="flex items-center justify-center gap-4 mt-2 text-sm text-muted-foreground">
              <span>{getCountryName()}</span>
              {clientData?.federal_state && (
                <>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{clientData.federal_state}</span>
                  </div>
                </>
              )}
            </div>
          </motion.div>

          {/* Progress overview */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 p-6 bg-card rounded-xl border"
          >
            <ProgressOverview stats={stats} />
          </motion.div>

          {/* Documents needing attention */}
          {needsAttention.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                {docs?.status?.documentsNeedAttention?.replace('{count}', String(needsAttention.length))}
              </h2>
              <div className="space-y-4">
                {needsAttention.map(doc => (
                  <DocumentStatusCard
                    key={doc.requirement.id}
                    document={doc}
                    onReupload={() => handleReupload(doc.requirement.id)}
                    onRetryValidation={doc.id ? () => retryValidation(doc.id, currentLanguage) : undefined}
                    onPreview={doc.file_path ? () => handlePreview(doc.file_path) : undefined}
                    language={currentLanguage}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Not submitted */}
          {notSubmitted.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="mb-8"
            >
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-muted-foreground"></span>
                {docs?.status?.documentsRequired?.replace('{count}', String(notSubmitted.length))}
              </h2>
              <div className="space-y-4">
                {notSubmitted.map(doc => (
                  <DocumentStatusCard
                    key={doc.requirement.id}
                    document={doc}
                    onReupload={() => handleReupload(doc.requirement.id)}
                    onRetryValidation={doc.id ? () => retryValidation(doc.id, currentLanguage) : undefined}
                    onPreview={doc.file_path ? () => handlePreview(doc.file_path) : undefined}
                    language={currentLanguage}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Pending review */}
          {pending.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                {docs?.status?.pendingReview} ({pending.length})
              </h2>
              <div className="space-y-4">
                {pending.map(doc => (
                  <DocumentStatusCard
                    key={doc.requirement.id}
                    document={doc}
                    onReupload={() => handleReupload(doc.requirement.id)}
                    onRetryValidation={doc.id ? () => retryValidation(doc.id, currentLanguage) : undefined}
                    onPreview={doc.file_path ? () => handlePreview(doc.file_path) : undefined}
                    language={currentLanguage}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Complete */}
          {complete.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="mb-8"
            >
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                {docs?.status?.documentsComplete?.replace('{count}', String(complete.length))}
              </h2>
              <div className="space-y-4">
                {complete.map(doc => (
                  <DocumentStatusCard
                    key={doc.requirement.id}
                    document={doc}
                    onReupload={() => handleReupload(doc.requirement.id)}
                    onRetryValidation={doc.id ? () => retryValidation(doc.id, currentLanguage) : undefined}
                    onPreview={doc.file_path ? () => handlePreview(doc.file_path) : undefined}
                    language={currentLanguage}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
          >
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/documents-upload')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {docs?.status?.continueUploading}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/contact')}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              {docs?.status?.contactSupport}
            </Button>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DocumentStatus;
