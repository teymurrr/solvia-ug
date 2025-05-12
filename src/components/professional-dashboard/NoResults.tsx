
import React from 'react';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';

interface NoResultsProps {
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}

const NoResults: React.FC<NoResultsProps> = ({
  title,
  description,
  actionLabel,
  onAction
}) => {
  const { t } = useLanguage();
  
  return (
    <div className="text-center py-8">
      <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
      <h3 className="mt-4 text-lg font-medium">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
      <Button variant="outline" className="mt-4" onClick={onAction}>
        {actionLabel}
      </Button>
    </div>
  );
};

export default NoResults;
