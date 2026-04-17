import { posthog } from '@/lib/posthog';

/**
 * Lightweight PostHog event helpers for product funnel tracking.
 * These are explicit (no autocapture) so we don't get duplicate noise.
 */

export const trackEligibilityClick = (source: string) => {
  posthog.capture('eligibility_cta_clicked', { source });
};

export const trackHomologationWizardCompleted = (props: {
  target_country?: string;
  doctor_type?: string;
  study_country?: string;
  language_level?: string;
}) => {
  posthog.capture('homologation_wizard_completed', props);
};

export const trackStripeRedirect = (props: {
  product_type: string;
  target_country?: string;
  amount?: number;
  source?: string;
}) => {
  posthog.capture('stripe_redirect', props);
};

export const trackSignupCompleted = (props: {
  user_type?: string;
  source?: string;
}) => {
  posthog.capture('signup_completed', props);
};

export const trackLeadSubmitted = (props: {
  source: string;
  email?: string;
}) => {
  // Identify the person in PostHog so future events tie to them
  if (props.email) {
    posthog.identify(props.email, { email: props.email });
  }
  posthog.capture('lead_submitted', { source: props.source });
};
