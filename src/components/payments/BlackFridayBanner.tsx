import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Zap, Clock } from 'lucide-react';

const LaunchWeekBanner: React.FC = () => {
  const { t } = useLanguage();
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [spotsLeft, setSpotsLeft] = useState(50);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Launch week ends 7 days from now (adjust based on actual launch date)
    const launchEnd = new Date();
    launchEnd.setDate(launchEnd.getDate() + 7);
    launchEnd.setHours(23, 59, 59, 0);

    const timer = setInterval(() => {
      const now = new Date();
      const diff = launchEnd.getTime() - now.getTime();

      if (diff <= 0) {
        setIsVisible(false);
        clearInterval(timer);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Simulate spots decreasing
  useEffect(() => {
    const interval = setInterval(() => {
      setSpotsLeft((prev) => Math.max(1, Math.floor(prev - Math.random() * 0.5)));
    }, 45000); // Update every 45 seconds
    return () => clearInterval(interval);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-red-900/80 via-orange-800/80 to-red-900/80 p-4 md:p-6 mb-8 border border-red-500/50">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-red-500/20 rounded-full blur-2xl animate-pulse" />
        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-orange-400/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-red-500 rounded-full animate-pulse">
            <Zap className="w-6 h-6 md:w-8 md:h-8 text-white" />
          </div>

          <div className="text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <span className="text-red-300 font-bold text-sm uppercase tracking-wider">
                🚀 {t?.payments?.launchWeek?.label || 'Launch Week Special'}
              </span>
            </div>
            <h3 className="text-white text-xl md:text-2xl font-bold mt-1">
              {t?.payments?.launchWeek?.title || '€99 Digital Starter - 70% OFF!'}
            </h3>
            <p className="text-red-100 text-sm mt-1">
              {t?.payments?.launchWeek?.subtitle || 'Only'} {Math.ceil(spotsLeft)} {t?.payments?.launchWeek?.spotsLeft || 'spots left at launch pricing'}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-end gap-2">
          <div className="flex items-center gap-2 text-red-300 font-bold">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-mono">
              {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
            </span>
          </div>
          <p className="text-red-200 text-xs">
            {t?.payments?.launchWeek?.countdown || 'Offer ends in'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LaunchWeekBanner;
