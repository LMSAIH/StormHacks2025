// Types for Impact Analysis data

export interface AnalysisSummary {
  _id: string;
  title: string;
  description: string;
  overallImportance: number; // 1-10 scale
}

export interface AnalyzedInfrastructure {
  _id: string;
  name: string;
  type: string;
  impactScore: number; // -10 to 10 scale
  quantitativeImpact: string;
  justification: string;
}

export interface ImpactReport {
  AnalysisSummary: AnalysisSummary;
  AnalyzedInfrastructure: AnalyzedInfrastructure[];
}

export interface ImpactAnalysisResponse {
  success: boolean;
  permit_id: string;
  report: ImpactReport;
}

// UI component props
export interface RightPanelProps {
  selectedPermit: any | null;
  isVisible?: boolean;
  onToggle?: () => void;
}