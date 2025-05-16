import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { MedicalReport, AnalysisResponse } from '../types';

interface MedicalReportContextType {
  currentReport: MedicalReport | null;
  reportHistory: MedicalReport[];
  isLoading: boolean;
  setCurrentReport: (report: MedicalReport | null) => void;
  uploadReport: (file: File) => Promise<boolean>;
  clearReport: () => void;
  fetchReportById: (reportId: string) => Promise<boolean>;
}

const MedicalReportContext = createContext<MedicalReportContextType | undefined>(undefined);

export function MedicalReportProvider({ children }: { children: ReactNode }) {
  const [currentReport, setCurrentReport] = useState<MedicalReport | null>(null);
  const [reportHistory, setReportHistory] = useState<MedicalReport[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log('MedicalReportProvider mounted');
    return () => {
      console.log('MedicalReportProvider unmounted');
    };
  }, []);

  const uploadReport = async (file: File) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:8003/api/v1/report/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response not OK:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(`Failed to analyze report: ${response.statusText}`);
      }

      const data: AnalysisResponse = await response.json();
      console.log('Backend response:', data);
      
      if (!data) {
        throw new Error('Empty response from server');
      }

      if (!data.analyzed) {
        console.error('Analysis failed:', data);
        throw new Error('Report analysis failed: Server indicated analysis was not successful');
      }

      if (!data.report) {
        console.error('No report in response:', data);
        throw new Error('Report analysis failed: No report data received');
      }

      setCurrentReport(data.report);
      setReportHistory(prev => [data.report, ...prev]);
      return true;
    } catch (error) {
      console.error('Error uploading report:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReportById = async (reportId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8003/api/v1/report/${reportId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch report');
      }

      const data: MedicalReport = await response.json();
      setCurrentReport(data);
      return true;
    } catch (error) {
      console.error('Error fetching report:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearReport = () => {
    setCurrentReport(null);
  };

  const value = {
    currentReport,
    reportHistory,
    isLoading,
    setCurrentReport,
    uploadReport,
    clearReport,
    fetchReportById,
  };

  console.log('MedicalReportProvider rendering with value:', value);

  return (
    <MedicalReportContext.Provider value={value}>
      {children}
    </MedicalReportContext.Provider>
  );
}

export function useMedicalReport() {
  const context = useContext(MedicalReportContext);
  if (context === undefined) {
    console.error('useMedicalReport hook called outside of MedicalReportProvider');
    throw new Error('useMedicalReport must be used within a MedicalReportProvider');
  }
  return context;
}