import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Download, Loader2 } from 'lucide-react';

interface Document {
  id: string;
  title: string;
  file_name: string;
  file_path: string;
  file_size: number | null;
  created_at: string;
}

interface DocumentListProps {
  country: string;
  region?: string | null;
}

const DocumentList: React.FC<DocumentListProps> = ({ country, region }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      let query = supabase
        .from('homologation_documents')
        .select('id, title, file_name, file_path, file_size, created_at')
        .eq('country', country)
        .order('created_at', { ascending: false });

      if (region) {
        query = query.eq('region', region);
      } else {
        query = query.is('region', null);
      }

      const { data, error } = await query;
      if (!error && data) {
        setDocuments(data);
      }
      setLoading(false);
    };

    fetchDocuments();
  }, [country, region]);

  const handleDownload = async (doc: Document) => {
    setDownloading(doc.id);
    try {
      const { data, error } = await supabase.storage
        .from('homologation-documents')
        .createSignedUrl(doc.file_path, 300);

      if (error) throw error;
      if (data?.signedUrl) {
        window.open(data.signedUrl, '_blank');
      }
    } catch (err) {
      console.error('Error downloading document:', err);
    } finally {
      setDownloading(null);
    }
  };

  const formatSize = (bytes: number | null) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
        <Loader2 className="w-3 h-3 animate-spin" />
        Loading documents...
      </div>
    );
  }

  if (documents.length === 0) return null;

  return (
    <div className="space-y-1.5">
      {documents.map((doc) => (
        <button
          key={doc.id}
          onClick={() => handleDownload(doc)}
          disabled={downloading === doc.id}
          className="w-full flex items-center gap-2 text-xs bg-muted hover:bg-muted/80 rounded-lg px-3 py-2 transition-colors text-left group"
        >
          <FileText className="w-3.5 h-3.5 text-destructive shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="font-medium text-foreground truncate">{doc.title}</div>
            {doc.file_size && (
              <div className="text-muted-foreground text-[10px]">{formatSize(doc.file_size)}</div>
            )}
          </div>
          {downloading === doc.id ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground shrink-0" />
          ) : (
            <Download className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary shrink-0" />
          )}
        </button>
      ))}
    </div>
  );
};

export default DocumentList;
