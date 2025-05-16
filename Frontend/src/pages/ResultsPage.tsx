import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Activity, AlertTriangle, Share2, Download } from 'lucide-react';
import { useMedicalReport } from '../context/MedicalReportContext';
import ResultCard from '../components/results/ResultCard';
import Button from '../components/ui/Button';
import ChatWidget from '../components/chat/ChatWidget';
import FullScreenLoader from '../components/ui/FullScreenLoader';
import ShareModal from '../components/ui/ShareModal';
import { usePDF } from 'react-to-pdf';

type StatusCounts = {
  normal: number;
  borderline: number;
  critical: number;
};

const ResultsPage = () => {
  const { currentReport, fetchReportById, isLoading } = useMedicalReport();
  const navigate = useNavigate();
  const { reportId } = useParams();
  const [searchParams] = useSearchParams();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const { toPDF, targetRef } = usePDF({filename: 'health-report.pdf'});

  const isSharedView = searchParams.get('share') === 'true';
  if (isSharedView && !isShared) {
    setIsShared(true);
  }
  // console.log("isSharedView", isSharedView);

  useEffect(() => {
    const loadReport = async () => {
      if (reportId && !currentReport?.report && isInitialLoad) {
        try {
          setIsInitialLoad(false);
          await fetchReportById(reportId);

        } catch (error) {
          console.error('Error loading report:', error);
          navigate('/upload');
        }
      } else if (!currentReport && !isInitialLoad) {
        navigate('/upload');
      }
    };

    loadReport();
  }, [reportId, isInitialLoad, navigate, fetchReportById]);

  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  const handleDownload = () => {
    toPDF();
  };

  // Count results by status
  const statusCounts: StatusCounts = currentReport?.report?.organs.reduce(
    (counts, organ) => {
      const status = organ.status.toLowerCase() as keyof StatusCounts;
      counts[status]++;
      return counts;
    },
    { normal: 0, borderline: 0, critical: 0 }
  ) || { normal: 0, borderline: 0, critical: 0 };

  if (isLoading) {
    return <FullScreenLoader message="Loading your report..." />;
  }

  if (!currentReport) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isShared ? "Sahil's Health Report" : "Your Health Results"}
              </h1>
              <p className="text-gray-600 mt-1">
                Analyzed on {new Date(currentReport?.report?.uploadDate || '').toLocaleDateString()} • {currentReport?.report?.fileName}
              </p>
            </div>
            <div className="flex gap-2 mt-4 sm:mt-0">
              {!isShared && (
                <>
                  <Button
                    variant="outline"
                    onClick={handleDownload}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Report
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        <div ref={targetRef}>
          {/* Summary Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Health Summary</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Activity className="h-5 w-5 text-success-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Normal</p>
                    <p className="text-2xl font-bold text-success-500">{statusCounts.normal}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <div className="flex items-center">
                  <div className="bg-yellow-100 p-2 rounded-full">
                    <AlertTriangle className="h-5 w-5 text-warning-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Borderline</p>
                    <p className="text-2xl font-bold text-warning-500">{statusCounts.borderline}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <div className="flex items-center">
                  <div className="bg-red-100 p-2 rounded-full">
                    <AlertTriangle className="h-5 w-5 text-danger-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Critical</p>
                    <p className="text-2xl font-bold text-danger-500">{statusCounts.critical}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {statusCounts.critical > 0 && (
              <div className="mt-6 p-4 border-l-4 border-red-500 bg-red-50 rounded-r-lg">
                <p className="text-sm text-red-800">
                  <strong>Important:</strong> Your results show critical values that may require medical attention. 
                  Please consult with your healthcare provider to discuss these findings.
                </p>
              </div>
            )}
          </div>

          {/* Results Detail Section */}
          <div className="space-y-6">
            {currentReport?.report?.organs.map((organResult) => (
              <ResultCard key={organResult.reportId} organResult={organResult} />
            ))}
          </div>

          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Important Note</h2>
            <p className="text-gray-600 text-sm">
              This analysis is provided for informational purposes only and is not a substitute for professional medical advice, 
              diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider 
              with any questions you may have regarding a medical condition.
            </p>
          </div>
        </div>
      </div>
      <ChatWidget reportId={reportId || ''} />
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        shareUrl={window.location.href}
      />
    </div>
  );
};

export default ResultsPage;