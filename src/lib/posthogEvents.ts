import { posthog } from '@/lib/posthog';

/**
 * Lightweight PostHog event helpers for product funnel tracking.
 * These are explicit (no autocapture) so we don't get duplicate noise.
 */

// Wizard step ids that count toward the funnel (post-data steps excluded).
export type FunnelWizardStep = 'country' | 'study-country' | 'doctor-type' | 'language' | 'email';

export const FUNNEL_STEP_ORDER: FunnelWizardStep[] = [
  'country',
  'study-country',
  'doctor-type',
  'language',
  'email',
];

export const isFunnelStep = (step: string): step is FunnelWizardStep =>
  (FUNNEL_STEP_ORDER as string[]).includes(step);

const baseProps = () => ({
  language:
    (typeof document !== 'undefined' && document.documentElement.lang) ||
    (typeof localStorage !== 'undefined' && localStorage.getItem('language')) ||
    'en',
});

export const trackEligibilityClick = (source: string) => {
  // TEMP: verify invocation in production — remove after confirming events arrive
  console.log('eligibility_cta_clicked fired:', source);
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

// ---- New funnel events ----

export const trackWizardStarted = () => {
  posthog.capture('homologation_wizard_started', baseProps());
};

export const trackWizardStepViewed = (step: FunnelWizardStep) => {
  posthog.capture('homologation_wizard_step_viewed', {
    ...baseProps(),
    step_name: step,
    step_number: FUNNEL_STEP_ORDER.indexOf(step) + 1,
  });
};

export const trackWizardStepCompleted = (
  step: FunnelWizardStep,
  time_on_step_ms: number,
) => {
  posthog.capture('homologation_wizard_step_completed', {
    ...baseProps(),
    step_name: step,
    step_number: FUNNEL_STEP_ORDER.indexOf(step) + 1,
    time_on_step_ms,
  });
};

export const trackWizardAbandoned = (last_step: FunnelWizardStep) => {
  posthog.capture('homologation_wizard_abandoned', {
    ...baseProps(),
    last_step_name: last_step,
    last_step_number: FUNNEL_STEP_ORDER.indexOf(last_step) + 1,
  });
};

export const trackPlanRevealed = (props: {
  target_country?: string;
  study_country?: string;
  doctor_type?: string;
}) => {
  posthog.capture('plan_revealed', { ...baseProps(), ...props });
};

export const trackPricingViewed = (props: { target_country?: string | null }) => {
  posthog.capture('pricing_viewed', {
    ...baseProps(),
    target_country: props.target_country ?? undefined,
  });
};

export type PricingTier = 'digital_starter' | 'complete' | 'personal_mentorship';

export const trackPricingTierSelected = (props: {
  tier: PricingTier;
  target_country?: string | null;
}) => {
  posthog.capture('pricing_tier_selected', {
    ...baseProps(),
    tier: props.tier,
    target_country: props.target_country ?? undefined,
  });
};

export const trackConsultationBooked = (source: string) => {
  posthog.capture('consultation_booked', { ...baseProps(), source });
};
