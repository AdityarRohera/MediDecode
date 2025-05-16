export interface ExtractionFromReport {
  testName: string;
  resultValue: string;
  expectedRange: string;
  unitOfMeasurement: string;
}

export type StatusType = 'Normal' | 'Borderline' | 'Critical';

export interface OrganResult {
  organ: string;
  status: StatusType;
  explanation: string;
  extractionFromReport: ExtractionFromReport;
  reportId: string;
}

export interface MedicalReport {
  userId: string;
  fileName: string;
  fileUrl: string;
  organs: OrganResult[];
  _id: string;
  uploadDate: string;
  __v: number;
}

export interface AnalysisResponse {
  analyzed: boolean;
  reportId: string;
  report?: MedicalReport;
}

export interface OrganSystem {
  id: string;
  name: string;
  status: 'normal' | 'borderline' | 'critical';
  icon: string;
  tests: TestResult[];
}

export interface TestResult {
  id: string;
  name: string;
  value: number | string;
  unit: string;
  referenceRange: string;
  status: 'normal' | 'borderline' | 'critical';
  explanation?: string;
}

export interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

export interface ResultCardProps {
  organResult: OrganResult;
}

export interface StatusBadgeProps {
  status: StatusType;
}

export interface LabelProps {
  children: React.ReactNode;
  htmlFor?: string;
}

export interface ButtonProps {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}