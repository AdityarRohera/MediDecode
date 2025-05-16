import { createContext, useContext, useState, ReactNode } from 'react';
import { MedicalReport, OrganSystem } from '../types';
import { mockProcessReport } from '../services/mockApi';

interface MedicalReportContextType {
  currentReport: MedicalReport | null;
  reportHistory: MedicalReport[];
  results: OrganSystem[];
  isLoading: boolean;
  setCurrentReport: (report: MedicalReport | null) => void;
  uploadReport: (file: File) => Promise<void>;
  clearReport: () => void;
}

const MedicalReportContext = createContext<MedicalReportContextType | undefined>(undefined);

export function MedicalReportProvider({ children }: { children: ReactNode }) {
  const [currentReport, setCurrentReport] = useState<MedicalReport | null>(null);
  const [reportHistory, setReportHistory] = useState<MedicalReport[]>([]);
  const [results, setResults] = useState<OrganSystem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const uploadReport = async (file: File) => {
    setIsLoading(true);
    try {
      const newReport: MedicalReport = {
        id: Date.now().toString(),
        fileName: file.name,
        uploadDate: new Date().toISOString(),
        processed: false,
      };
      
      setCurrentReport(newReport);
      
      const processedResults = await mockProcessReport(file);
      
      const processedReport = {
        ...newReport,
        processed: true,
      };

      setResults(processedResults);
      setCurrentReport(processedReport);
      setReportHistory(prev => [processedReport, ...prev]);
    } catch (error) {
      console.error('Error uploading report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearReport = () => {
    setCurrentReport(null);
    setResults([]);
  };

  return (
    <MedicalReportContext.Provider
      value={{
        currentReport,
        reportHistory,
        results,
        isLoading,
        setCurrentReport,
        uploadReport,
        clearReport,
      }}
    >
      {children}
    </MedicalReportContext.Provider>
  );
}

export function useMedicalReport() {
  const context = useContext(MedicalReportContext);
  if (context === undefined) {
    throw new Error('useMedicalReport must be used within a MedicalReportProvider');
  }
  return context;
}