import React from 'react';
import { Languages } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface TranslatedBadgeProps {
  label?: string;
}

const TranslatedBadge: React.FC<TranslatedBadgeProps> = ({ label = 'Translated' }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Badge variant="secondary" className="text-xs py-0 px-1.5 gap-0.5 font-normal">
        <Languages className="h-3 w-3" />
        {label}
      </Badge>
    </TooltipTrigger>
    <TooltipContent>
      <p>Auto-translated from the original language</p>
    </TooltipContent>
  </Tooltip>
);

export default TranslatedBadge;
