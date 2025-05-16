import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMedicalReport } from '../context/MedicalReportContext';
import FileUpload from '../components/upload/FileUpload';
import { FileText, Check, Upload as UploadIcon } from 'lucide-react';
import FullScreenLoader from '../components/ui/FullScreenLoader';

const UploadPage = () => {
  const { uploadReport, isLoading, currentReport } = useMedicalReport();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Redirect to results page if report is already processed
    if (currentReport && currentReport.processed) {
      navigate('/results');
    }
  }, [currentReport, navigate]);

  const handleFileSelect = async (file: File) => {
    try {
      setIsProcessing(true);
      await uploadReport(file);
    } catch (error) {
      console.error('Error uploading file:', error);
      setIsProcessing(false);
    }
  };

  // Show full screen loader when either processing or loading
  if (isProcessing || isLoading) {
    return <FullScreenLoader message="Analyzing your medical report..." />;
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <UploadIcon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Upload Your Medical Report
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            We'll analyze your report and provide personalized health insights organized by organ system.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex justify-center mb-8">
              <ol className="flex items-center w-full max-w-lg">
                <li className="flex items-center text-primary-600 font-medium">
                  <span className="flex items-center justify-center w-8 h-8 border-2 border-primary-600 rounded-full shrink-0">
                    <FileText className="w-4 h-4" />
                  </span>
                  <span className="ml-2">Upload</span>
                  <span className="ml-2 mr-2 text-gray-300">/</span>
                </li>
                <li className="flex items-center text-gray-400">
                  <span className="flex items-center justify-center w-8 h-8 border-2 border-gray-300 rounded-full shrink-0">
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-primary-600 rounded-full animate-spin"></div>
                    ) : (
                      <span className="w-4 h-4" />
                    )}
                  </span>
                  <span className="ml-2">Processing</span>
                  <span className="ml-2 mr-2 text-gray-300">/</span>
                </li>
                <li className="flex items-center text-gray-400">
                  <span className="flex items-center justify-center w-8 h-8 border-2 border-gray-300 rounded-full shrink-0">
                    <Check className="w-4 h-4" />
                  </span>
                  <span className="ml-2">Results</span>
                </li>
              </ol>
            </div>

            <FileUpload onFileSelect={handleFileSelect} isLoading={isLoading} />

            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Supported Report Types</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-success-500 mr-2" />
                  Complete Blood Count (CBC)
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-success-500 mr-2" />
                  Comprehensive Metabolic Panel (CMP)
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-success-500 mr-2" />
                  Lipid Panel
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-success-500 mr-2" />
                  Liver Function Tests
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-success-500 mr-2" />
                  Thyroid Function Tests
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-success-500 mr-2" />
                  And many more common lab tests
                </li>
              </ul>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Your privacy is our priority. All reports are processed securely and are not stored after analysis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;