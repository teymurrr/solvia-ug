
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export type CookieCategory = 'essential' | 'analytics' | 'marketing' | 'functional';

export interface CookieConsent {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

export interface CookiePreferences {
  hasConsented: boolean;
  consentDate: string;
  consent: CookieConsent;
}

const DEFAULT_CONSENT: CookieConsent = {
  essential: true, // Always true - required for basic functionality
  analytics: false,
  marketing: false,
  functional: false,
};

const CONSENT_COOKIE_NAME = 'cookie-consent';
const CONSENT_EXPIRY_DAYS = 365;

export const useCookies = () => {
  const [preferences, setPreferences] = useState<CookiePreferences | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  // Load existing consent on mount
  useEffect(() => {
    const savedConsent = Cookies.get(CONSENT_COOKIE_NAME);
    
    if (savedConsent) {
      try {
        const parsed = JSON.parse(savedConsent) as CookiePreferences;
        setPreferences(parsed);
        setShowBanner(false);
      } catch (error) {
        console.error('Error parsing cookie consent:', error);
        setShowBanner(true);
      }
    } else {
      setShowBanner(true);
    }
  }, []);

  // Set cookie with category check
  const setCookie = (
    name: string,
    value: string,
    category: CookieCategory,
    options?: Cookies.CookieAttributes
  ) => {
    if (!preferences) return false;
    
    // Essential cookies are always allowed
    if (category === 'essential' || preferences.consent[category]) {
      Cookies.set(name, value, options);
      return true;
    }
    
    return false;
  };

  // Get cookie value
  const getCookie = (name: string): string | undefined => {
    return Cookies.get(name);
  };

  // Remove cookie
  const removeCookie = (name: string, options?: Cookies.CookieAttributes) => {
    Cookies.remove(name, options);
  };

  // Save consent preferences
  const saveConsent = (consent: CookieConsent) => {
    const consentData: CookiePreferences = {
      hasConsented: true,
      consentDate: new Date().toISOString(),
      consent,
    };

    Cookies.set(CONSENT_COOKIE_NAME, JSON.stringify(consentData), {
      expires: CONSENT_EXPIRY_DAYS,
      sameSite: 'lax',
    });

    setPreferences(consentData);
    setShowBanner(false);

    // Clean up non-consented cookies
    cleanupCookies(consent);
  };

  // Accept all cookies
  const acceptAll = () => {
    const allConsent: CookieConsent = {
      essential: true,
      analytics: true,
      marketing: true,
      functional: true,
    };
    saveConsent(allConsent);
  };

  // Accept only essential cookies
  const acceptEssential = () => {
    saveConsent(DEFAULT_CONSENT);
  };

  // Clean up cookies based on consent
  const cleanupCookies = (consent: CookieConsent) => {
    // Remove analytics cookies if not consented
    if (!consent.analytics) {
      // Add your analytics cookie names here
      removeCookie('_ga');
      removeCookie('_gid');
      removeCookie('_gat');
    }

    // Remove marketing cookies if not consented
    if (!consent.marketing) {
      // Add your marketing cookie names here
      removeCookie('_fbp');
      removeCookie('_fbc');
    }

    // Remove functional cookies if not consented
    if (!consent.functional) {
      // Add your functional cookie names here
      removeCookie('theme-preference');
      removeCookie('sidebar-state');
    }
  };

  // Reset all consent
  const resetConsent = () => {
    removeCookie(CONSENT_COOKIE_NAME);
    setPreferences(null);
    setShowBanner(true);
    
    // Clean up all non-essential cookies
    cleanupCookies(DEFAULT_CONSENT);
  };

  return {
    preferences,
    showBanner,
    setCookie,
    getCookie,
    removeCookie,
    saveConsent,
    acceptAll,
    acceptEssential,
    resetConsent,
    hasConsented: preferences?.hasConsented || false,
    canUseAnalytics: preferences?.consent.analytics || false,
    canUseMarketing: preferences?.consent.marketing || false,
    canUseFunctional: preferences?.consent.functional || false,
  };
};
