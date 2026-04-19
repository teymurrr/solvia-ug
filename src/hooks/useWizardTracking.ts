import { useEffect, useRef } from 'react';
import {
  FunnelWizardStep,
  isFunnelStep,
  trackWizardStarted,
  trackWizardStepViewed,
  trackWizardStepCompleted,
  trackWizardAbandoned,
} from '@/lib/posthogEvents';

/**
 * Tracks per-step views, time-on-step, and abandonment for the homologation
 * wizard. Non-funnel steps (firstName/lastName/password/summary) are ignored
 * so the funnel stays clean.
 *
 * Wizard completion is already tracked via `trackHomologationWizardCompleted`
 * in HomologationWizard.tsx, so we don't double-fire it here.
 */
export function useWizardTracking(currentStep: string, isComplete: boolean) {
  const startedRef = useRef(false);
  const stepStartRef = useRef<number>(Date.now());
  const lastStepRef = useRef<FunnelWizardStep | null>(null);
  const completedRef = useRef(isComplete);

  // Initial: fire wizard_started + first step view
  useEffect(() => {
    if (startedRef.current) return;
    if (!isFunnelStep(currentStep)) return;
    trackWizardStarted();
    trackWizardStepViewed(currentStep);
    lastStepRef.current = currentStep;
    stepStartRef.current = Date.now();
    startedRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Step transitions
  useEffect(() => {
    if (!startedRef.current) return;
    if (!isFunnelStep(currentStep)) return;
    if (lastStepRef.current === currentStep) return;

    const now = Date.now();
    if (lastStepRef.current) {
      trackWizardStepCompleted(lastStepRef.current, now - stepStartRef.current);
    }
    trackWizardStepViewed(currentStep);
    lastStepRef.current = currentStep;
    stepStartRef.current = now;
  }, [currentStep]);

  // Completion: mark the last funnel step as completed (avoid abandonment fire)
  useEffect(() => {
    completedRef.current = isComplete;
    if (isComplete && startedRef.current && lastStepRef.current) {
      trackWizardStepCompleted(
        lastStepRef.current,
        Date.now() - stepStartRef.current,
      );
    }
  }, [isComplete]);

  // Abandonment on tab close / navigation away
  useEffect(() => {
    const handler = () => {
      if (
        startedRef.current &&
        !completedRef.current &&
        lastStepRef.current
      ) {
        trackWizardAbandoned(lastStepRef.current);
      }
    };
    window.addEventListener('pagehide', handler);
    return () => window.removeEventListener('pagehide', handler);
  }, []);
}
