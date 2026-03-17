import React, { useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAdmin } from '@/hooks/useAdmin';
import { useAuth } from '@/contexts/AuthContext';
import { Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface DocumentUploadProps {
  country: string;
  region?: string | null;
  onUploaded?: () => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ country, region, onUploaded }) => {
  const { isAdmin } = useAdmin();
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isAdmin) return null;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      toast.error('File must be under 20MB');
      return;
    }

    setUploading(true);
    try {
      const storagePath = `${country}/${region || 'general'}/${Date.now()}_${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from('homologation-documents')
        .upload(storagePath, file);

      if (uploadError) throw uploadError;

      const title = file.name.replace(/\.pdf$/i, '').replace(/[_-]/g, ' ');

      const { error: dbError } = await supabase
        .from('homologation_documents')
        .insert({
          country,
          region: region || null,
          title,
          file_path: storagePath,
          file_name: file.name,
          file_size: file.size,
          uploaded_by: user.id,
        });

      if (dbError) throw dbError;

      toast.success('Document uploaded');
      onUploaded?.();
    } catch (err: any) {
      console.error('Upload error:', err);
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileSelect}
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="flex items-center gap-1 text-[10px] text-primary hover:text-primary/80 font-medium transition-colors"
      >
        {uploading ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : (
          <Upload className="w-3 h-3" />
        )}
        {uploading ? 'Uploading...' : 'Upload PDF'}
      </button>
    </>
  );
};

export default DocumentUpload;
