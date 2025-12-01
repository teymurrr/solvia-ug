import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Save, FileCheck, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/contexts/AuthContext';
import { useDocuments } from '@/hooks/useDocuments';
import { DocumentUploadCard } from '@/components/documents/DocumentUploadCard';
import { supabase } from '@/integrations/supabase/client';
import MainLayout from '@/components/MainLayout';

const DocumentUpload: React.FC = () => {
  const navigate = useNavigate();
  const { t, currentLanguage } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const [clientData, setClientData] = useState<{ target_country: string; federal_state: string | null } | null>(null);
  const [loadingClient, setLoadingClient] = useState(true);

  const docs = t.documents as any;
  const countryKey = clientData?.target_country?.toLowerCase() || 'germany';
  
  const {
    requirements,
    loading: docsLoading,
    uploading,
    uploadDocument,
    deleteDocument,
    getDocumentForRequirement,
    getProgressStats,
    getDocumentPreviewUrl,
  } = useDocuments(countryKey);

  // Fetch client data to get target country
  useEffect(() => {
    const fetchClientData = async () => {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from('clients')
        .select('target_country, federal_state')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching client:', error);
        // Redirect to onboarding if no client record
        navigate('/onboarding');
        return;
      }

      if (!data?.target_country) {
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
  const allUploaded = stats.uploaded === stats.total && stats.total > 0;

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

  const handleUpload = async (requirementId: string, file: File) => {
    await uploadDocument(requirementId, file, currentLanguage);
  };

  const handleDelete = (documentId: string) => {
    if (documentId) {
      deleteDocument(documentId);
    }
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

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              {docs?.upload?.title}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {docs?.upload?.subtitle?.replace('{country}', getCountryName())}
            </p>
            {clientData?.federal_state && (
              <div className="flex items-center justify-center gap-2 mt-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{clientData.federal_state}</span>
              </div>
            )}
          </motion.div>

          {/* Progress bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 p-4 bg-card rounded-xl border"
          >
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">
                {docs?.upload?.progress
                  ?.replace('{uploaded}', String(stats.uploaded))
                  ?.replace('{total}', String(stats.total))}
              </span>
              <span className="font-semibold">{stats.percentage}%</span>
            </div>
            <Progress value={stats.percentage} className="h-2" />
          </motion.div>

          {/* Document cards */}
          <div className="grid gap-4 mb-8">
            {requirements.map((req, index) => {
              const doc = getDocumentForRequirement(req.id);
              return (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <DocumentUploadCard
                    requirement={req}
                    document={doc}
                    onUpload={(file) => handleUpload(req.id, file)}
                    onDelete={() => handleDelete(doc?.id || '')}
                    onPreview={doc?.file_path ? () => handlePreview(doc.file_path) : undefined}
                    isUploading={uploading === req.id}
                    language={currentLanguage}
                  />
                </motion.div>
              );
            })}
          </div>

          {/* All uploaded message */}
          {allUploaded && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl text-center"
            >
              <FileCheck className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-green-600 dark:text-green-400 font-medium">
                {docs?.upload?.allUploaded}
              </p>
            </motion.div>
          )}

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/')}
            >
              <Save className="h-4 w-4 mr-2" />
              {docs?.upload?.saveAndContinue}
            </Button>
            <Button
              size="lg"
              onClick={() => navigate('/documents-status')}
              disabled={stats.uploaded === 0}
            >
              {docs?.upload?.viewStatus}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DocumentUpload;
