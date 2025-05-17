import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { FileText, Calendar, Activity, X, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import StatusBadge from '../components/ui/StatusBadge';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { StatusType } from '../types';

interface ComparisonItem {
  testName: string;
  organ: string;
  change: 'Improved' | 'Worsened' | 'Unchanged';
  oldValue: string;
  newValue: string;
  expectedRange: string;
  unitOfMeasurement: string;
  statusNow: StatusType;
  feedback: string;
  prevReportDate: string;
  currReportDate: string;
}

interface CompareDetails {
  compareId: string;
  comparisons: ComparisonItem[];
}

const history = [
  {
    reportId: "833edfd6-e90e-4a5f-b720-0ba46f6d5e65",
      userId: "f2c7433f-1afc-497c-8356-1fb09e4ed359",
      fileName: "medical report 2.pdf", 
      fileUrl: "uploads/db1fb86b6c489f271d5124a43659c90c",
      uploadDate: new Date("2025-05-16T11:34:43.793Z"),
      _id: "682722d3db6c8d33a0f77542",
      __v: 0,
      organs: [
        {
          organ: "Electrolytes",
          status: "Borderline", 
          explanation: "Your calcium is a bit high. Better check with a doctor to be sure!",
          extractionFromReport: {
            test: "Electrolytes",
            resultValue: 100,
            expectedRange: "100-120",
            unitOfMeasurement: "mg/dL",
            _id: "682722d3db6c8d33a0f77542"
          },
        }
      ]
  },
   {
    reportId: "833edfd6-e90e-4a5f-b720-0ba46f6d5e66",
      userId: "f2c7433f-1afc-497c-8356-1fb09e4ed359",
      fileName: "medical report 2.pdf", 
      fileUrl: "uploads/db1fb86b6c489f271d5124a43659c90c",
      uploadDate: new Date("2025-05-16T11:34:43.793Z"),
      _id: "682722d3db6c8d33a0f77542",
      __v: 0,
      organs: [
        {
          organ: "Electrolytes",
          status: "Borderline", 
          explanation: "Your calcium is a bit high. Better check with a doctor to be sure!",
          extractionFromReport: {
            test: "Electrolytes",
            resultValue: 100,
            expectedRange: "100-120",
            unitOfMeasurement: "mg/dL",
            _id: "682722d3db6c8d33a0f77542"
          },
        }
      ]
  }
]

const ComparisonChart = ({ 
  oldValue, 
  newValue, 
  expectedRange, 
  unitOfMeasurement 
}: { 
  oldValue: string; 
  newValue: string; 
  expectedRange: string; 
  unitOfMeasurement: string;
}) => {
  const [min, max] = expectedRange.split('-').map(Number);
  const oldVal = Number(oldValue);
  const newVal = Number(newValue);
  
  // Calculate the scale to fit the values
  const range = max - min;
  const padding = range * 0.2; // 20% padding
  const scaleMin = Math.min(min - padding, oldVal, newVal);
  const scaleMax = Math.max(max + padding, oldVal, newVal);
  const scaleRange = scaleMax - scaleMin;

  // Calculate positions
  const getPosition = (value: number) => {
    return ((value - scaleMin) / scaleRange) * 100;
  };

  const oldPosition = getPosition(oldVal);
  const newPosition = getPosition(newVal);
  const minPosition = getPosition(min);
  const maxPosition = getPosition(max);

  return (
    <div className="relative h-24 mt-4">
      {/* Range indicator */}
      <div 
        className="absolute h-2 bg-gray-200 rounded-full"
        style={{ 
          left: `${minPosition}%`, 
          right: `${100 - maxPosition}%`,
          top: '50%',
          transform: 'translateY(-50%)'
        }}
      />
      
      {/* Min and max labels */}
      <div className="absolute text-xs text-gray-500" style={{ left: `${minPosition}%`, top: '100%' }}>
        {min} {unitOfMeasurement}
      </div>
      <div className="absolute text-xs text-gray-500" style={{ right: `${100 - maxPosition}%`, top: '100%' }}>
        {max} {unitOfMeasurement}
      </div>

      {/* Old value bar */}
      <div 
        className="absolute w-2 h-8 bg-primary-500 rounded-full"
        style={{ 
          left: `${oldPosition}%`,
          top: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      >
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs font-medium text-primary-700">
          {oldValue}
        </div>
      </div>

      {/* New value bar */}
      <div 
        className="absolute w-2 h-8 bg-success-500 rounded-full"
        style={{ 
          left: `${newPosition}%`,
          top: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      >
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs font-medium text-success-700">
          {newValue}
        </div>
      </div>

      {/* Legend */}
      <div className="absolute -bottom-6 left-0 right-0 flex justify-center space-x-4 text-xs">
        <div className="flex items-center">
          <div className="w-2 h-2 bg-primary-500 rounded-full mr-1"></div>
          <span className="text-gray-600">Previous</span>
        </div>
        <div className="flex items-center">
          <div className="w-2 h-2 bg-success-500 rounded-full mr-1"></div>
          <span className="text-gray-600">Current</span>
        </div>
        <div className="flex items-center">
          <div className="w-2 h-2 bg-gray-200 rounded-full mr-1"></div>
          <span className="text-gray-600">Normal Range</span>
        </div>
      </div>
    </div>
  );
};

const HistoryPage = () => {
  const [reportHistory, setReportHistory] = useState();
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [compareDetails, setCompareDetails] = useState<CompareDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReportHistory = async () => {
      try {
        const response = await axios.get('http://localhost:8003/api/v1/user/history');
        setReportHistory(response.data.history);
      } catch (error) {
        console.error('Error fetching report history:', error);
      }
    };
    fetchReportHistory();
  }, []);

  const handleReportSelect = (reportId: string) => {
    setSelectedReports(prev => {
      if (prev.includes(reportId)) {
        return prev.filter(id => id !== reportId);
      }
      if (prev.length >= 2) {
        return prev;
      }
      return [...prev, reportId];
    });
  };

  const handleCompare = async () => {
    console.log("selectedReports -> ", selectedReports);
    if (selectedReports.length !== 2) return;
    console.log("selectedReports -> ", selectedReports);
    
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create dummy comparison data
      const dummyCompareDetails: CompareDetails = {
        compareId: "dummy-compare-id",
        comparisons: [
          {
            testName: "Vitamin B12",
            organ: "Blood",
            change: "Improved",
            oldValue: "120",
            newValue: "450",
            expectedRange: "200-900",
            unitOfMeasurement: "pg/mL",
            prevReportDate : "2025-05-16T11:34:43.793Z",
            currReportDate : "2025-05-16T11:34:43.793Z",
            statusNow: "Normal",
            feedback: "Your Vitamin B12 is now in a healthy range. Great work!"
          },
          {
            testName: "Calcium",
            organ: "Electrolytes",
            change: "Worsened",
            oldValue: "9.5",
            newValue: "11.2",
            expectedRange: "8.5-10.5",
            unitOfMeasurement: "mg/dL",
            prevReportDate : "2025-05-16T11:34:43.793Z",
            currReportDate : "2025-05-16T11:34:43.793Z",
            statusNow: "Critical",
            feedback: "Your calcium levels have increased significantly. Please consult your doctor."
          }
        ]
      };
      
      setCompareDetails(dummyCompareDetails);
      setIsCompareModalOpen(true);
    } catch (error) {
      console.error('Error comparing reports:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen py-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Report History</h1>
              <p className="text-gray-600">View and manage your past medical reports</p>
            </div>
            {selectedReports.length === 2 && (
              <button
                onClick={handleCompare}
                disabled={isLoading}
                className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Comparing...' : 'Compare Reports'}
              </button>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {reportHistory && reportHistory?.length > 0 ? (
            reportHistory && reportHistory.map((report) => (
              <motion.div
                key={report.reportId}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <input
                        type="checkbox"
                        checked={selectedReports.includes(report.reportId)}
                        onChange={() => handleReportSelect(report.reportId)}
                        className="h-5 w-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                      />
                      <div className="p-2 bg-primary-100 rounded-full">
                        <FileText className="h-6 w-6 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{report.fileName}</h3>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            {format(new Date(report.uploadDate), 'MMM d, yyyy')}
                          </span>
                          <div className="flex items-center space-x-2">
                            <Activity className="h-4 w-4 text-gray-500" />
                            <div className="flex space-x-2">
                              <StatusBadge status="Normal" />
                              <StatusBadge status="Borderline" />
                              <StatusBadge status="Critical" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      className="px-4 py-2 bg-primary-50 text-primary-600 rounded-md hover:bg-primary-100 transition-colors"
                      onClick={() => navigate(`/results/${report.reportId}`)}
                    >
                      View Report
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Reports Yet</h3>
              <p className="text-gray-600">Upload your first medical report to get started</p>
            </div>
          )}
        </div>
      </div>

      {/* Comparison Modal */}
      {isCompareModalOpen && compareDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-11/12 h-5/6 max-w-7xl relative overflow-hidden">
            <button
              onClick={() => setIsCompareModalOpen(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
            <div className="p-6 h-full overflow-y-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Report Comparison</h2>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-primary-500 mr-2"></div>
                    <span>Previous: {format(new Date(compareDetails.comparisons[0].prevReportDate), 'MMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-success-500 mr-2"></div>
                    <span>Current: {format(new Date(compareDetails.comparisons[0].currReportDate), 'MMM d, yyyy')}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {compareDetails.comparisons.map((comparison, index) => (
                  <div key={index} className="border rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{comparison.testName}</h3>
                        <p className="text-sm text-gray-500 mt-1">{comparison.organ}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        {comparison.change === 'Improved' && (
                          <div className="flex items-center bg-success-50 px-3 py-1.5 rounded-full">
                            <TrendingUp className="h-5 w-5 text-success-500 mr-1.5" />
                            <span className="text-sm font-medium text-success-700">Improved</span>
                          </div>
                        )}
                        {comparison.change === 'Worsened' && (
                          <div className="flex items-center bg-danger-50 px-3 py-1.5 rounded-full">
                            <TrendingDown className="h-5 w-5 text-danger-500 mr-1.5" />
                            <span className="text-sm font-medium text-danger-700">Worsened</span>
                          </div>
                        )}
                        {comparison.change === 'Unchanged' && (
                          <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-full">
                            <Minus className="h-5 w-5 text-gray-500 mr-1.5" />
                            <span className="text-sm font-medium text-gray-700">Unchanged</span>
                          </div>
                        )}
                        <StatusBadge status={comparison.statusNow} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center mb-2">
                          <div className="w-3 h-3 rounded-full bg-primary-500 mr-2"></div>
                          <p className="text-sm font-medium text-gray-700">Previous Value</p>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                          {comparison.oldValue} <span className="text-sm font-normal text-gray-500">{comparison.unitOfMeasurement}</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {format(new Date(comparison.prevReportDate), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center mb-2">
                          <div className="w-3 h-3 rounded-full bg-success-500 mr-2"></div>
                          <p className="text-sm font-medium text-gray-700">Current Value</p>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                          {comparison.newValue} <span className="text-sm font-normal text-gray-500">{comparison.unitOfMeasurement}</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {format(new Date(comparison.currReportDate), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>

                    {/* Add the comparison chart */}
                    <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
                      <p className="text-sm font-medium text-gray-700 mb-4">Value Comparison</p>
                      <ComparisonChart
                        oldValue={comparison.oldValue}
                        newValue={comparison.newValue}
                        expectedRange={comparison.expectedRange}
                        unitOfMeasurement={comparison.unitOfMeasurement}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <p className="text-sm font-medium text-gray-700 mb-1">Expected Range</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {comparison.expectedRange} <span className="text-sm font-normal text-gray-500">{comparison.unitOfMeasurement}</span>
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <p className="text-sm font-medium text-gray-700 mb-1">Feedback</p>
                        <p className="text-sm text-gray-600 italic">{comparison.feedback}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default HistoryPage;