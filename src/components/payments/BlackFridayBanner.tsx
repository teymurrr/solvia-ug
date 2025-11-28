import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Tag, Sparkles } from 'lucide-react';

const BlackFridayBanner: React.FC = () => {
  const { t } = useLanguage();
  
  // Check if banner should be shown (until Dec 6, 2025)
  const endDate = new Date('2025-12-06T23:59:59Z');
  const now = new Date();
  
  if (now > endDate) {
    return null;
  }

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-4 md:p-6 mb-8 border border-yellow-500/30">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-yellow-500/20 rounded-full blur-2xl animate-pulse" />
        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-yellow-400/10 rounded-full blur-3xl animate-pulse delay-300" />
      </div>
      
      <div className="relative flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-yellow-500 rounded-full">
            <Tag className="w-6 h-6 md:w-8 md:h-8 text-gray-900" />
          </div>
          
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 font-bold text-sm uppercase tracking-wider">
                {t?.payments?.blackFriday?.label || 'Black Friday'}
              </span>
              <Sparkles className="w-4 h-4 text-yellow-400" />
            </div>
            <h3 className="text-white text-xl md:text-2xl font-bold mt-1">
              {t?.payments?.blackFriday?.title || '25% OFF All Packages!'}
            </h3>
            <p className="text-gray-300 text-sm mt-1">
              {t?.payments?.blackFriday?.subtitle || 'Use code'}{' '}
              <code className="bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded font-mono font-bold">
                BLACKFRIDAY
              </code>
            </p>
          </div>
        </div>
        
        <div className="flex flex-col items-center md:items-end">
          <div className="text-yellow-400 text-3xl md:text-4xl font-black">
            -25%
          </div>
          <p className="text-gray-400 text-xs mt-1">
            {t?.payments?.blackFriday?.validUntil || 'Valid until Dec 6'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BlackFridayBanner;
