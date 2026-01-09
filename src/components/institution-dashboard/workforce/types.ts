// Workforce Analytics Types

export interface KPIData {
  totalFTE: number;
  plannedFTE: number;
  staffingCoverage: number;
  openPositionsCritical: number;
  sickLeaveRate: number;
}

export interface DepartmentRisk {
  id: string;
  name: string;
  riskLevel: 'high' | 'medium' | 'stable';
  vacancyRate: number;
  sickLeaveTrend: 'up' | 'stable' | 'down';
  overtimeHours: number;
  contractExpiries: number;
}

export interface CostData {
  monthlyPersonnelCost: number;
  monthlyBudget: number;
  overtimeCost: number;
  overtimeTrend: 'up' | 'stable' | 'down';
  insight?: string;
}

export interface HiringBlocker {
  id: string;
  role: string;
  daysOpen: number;
  blockerType: 'approval_delay' | 'candidate_pipeline' | 'onboarding_admin';
  isCritical: boolean;
}

export interface InternationalHire {
  id: string;
  name: string;
  status: 'pending' | 'in_progress' | 'approved';
  country: string;
}

export interface WorkforceData {
  kpis: KPIData;
  departments: DepartmentRisk[];
  costs: CostData;
  hiringBlockers: HiringBlocker[];
  internationalHires: InternationalHire[];
  lastUpdated: Date;
  isDemo: boolean;
}
