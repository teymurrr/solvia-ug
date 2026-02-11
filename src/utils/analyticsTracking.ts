/**
 * GA4 Event Tracking Utility
 * Fires custom GA4 events while respecting user cookie consent preferences
 */

declare global {
  interface Window {
    gtag: (
      command: string,
      eventName: string,
      params?: Record<string, string | number | boolean | undefined>
    ) => void;
  }
}

export type GA4EventName =
  | 'assessment_started'
  | 'assessment_completed'
  | 'signup_completed'
  | 'profile_completed'
  | 'country_selected'
  | 'payment_started'
  | 'payment_completed'
  | 'starter_kit_purchased'
  | 'document_uploaded'
  | 'vacancy_saved'
  | 'vacancy_applied';

interface GA4EventParams {
  [key: string]: string | number | boolean | undefined;
}

/**
 * Get cookie consent status from localStorage
 * Mirrors the useCookies hook implementation
 */
function getAnalyticsConsent(): boolean {
  try {
    const consentCookie = localStorage.getItem('cookie-consent');
    if (!consentCookie) {
      return false; // No consent yet
    }
    
    const parsed = JSON.parse(consentCookie);
    return parsed?.consent?.analytics === true;
  } catch (error) {
    console.error('Error reading cookie consent:', error);
    return false;
  }
}

/**
 * Track a GA4 event
 * @param eventName - The GA4 event name
 * @param params - Optional event parameters
 * @returns boolean indicating if event was tracked
 */
export function trackEvent(eventName: GA4EventName, params?: GA4EventParams): boolean {
  // Only fire events if user has consented to analytics
  if (!getAnalyticsConsent()) {
    console.debug(`[Analytics] Event "${eventName}" not tracked - analytics consent not given`);
    return false;
  }

  // Check if GA4 is available
  if (typeof window === 'undefined' || !window.gtag) {
    console.warn(`[Analytics] gtag not available for event "${eventName}"`);
    return false;
  }

  try {
    window.gtag('event', eventName, params || {});
    console.debug(`[Analytics] Event tracked: "${eventName}"`, params || {});
    return true;
  } catch (error) {
    console.error(`[Analytics] Error tracking event "${eventName}":`, error);
    return false;
  }
}

/**
 * Track funnel-specific events with standard parameters
 */

export const Analytics = {
  // Acquisition events
  assessmentStarted: (assessmentType?: string) =>
    trackEvent('assessment_started', { assessment_type: assessmentType }),
  
  assessmentCompleted: (assessmentType?: string, timeSpent?: number) =>
    trackEvent('assessment_completed', {
      assessment_type: assessmentType,
      time_spent_seconds: timeSpent,
    }),

  // Activation events
  signupCompleted: (userType?: string) =>
    trackEvent('signup_completed', { user_type: userType }),
  
  profileCompleted: (profileSection?: string) =>
    trackEvent('profile_completed', { profile_section: profileSection }),
  
  countrySelected: (country: string) =>
    trackEvent('country_selected', { country }),

  // Revenue events
  paymentStarted: (productType: string, amount?: number) =>
    trackEvent('payment_started', {
      product_type: productType,
      amount: amount,
    }),
  
  paymentCompleted: (productType: string, amount: number, currency?: string) =>
    trackEvent('payment_completed', {
      product_type: productType,
      amount,
      currency: currency || 'EUR',
    }),
  
  starterKitPurchased: (amount: number, currency?: string) =>
    trackEvent('starter_kit_purchased', {
      amount,
      currency: currency || 'EUR',
    }),

  // Engagement events
  documentUploaded: (documentType: string, fileSize?: number) =>
    trackEvent('document_uploaded', {
      document_type: documentType,
      file_size_bytes: fileSize,
    }),
  
  vacancySaved: (vacancyId: string, country?: string) =>
    trackEvent('vacancy_saved', {
      vacancy_id: vacancyId,
      country,
    }),
  
  vacancyApplied: (vacancyId: string, country?: string) =>
    trackEvent('vacancy_applied', {
      vacancy_id: vacancyId,
      country,
    }),
};

export default Analytics;
