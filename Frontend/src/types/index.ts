export interface MedicalReport {
  id: string;
  fileName: string;
  uploadDate: string;
  processed: boolean;
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
  organSystem: OrganSystem;
}

export interface StatusBadgeProps {
  status: 'normal' | 'borderline' | 'critical';
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