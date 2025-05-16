import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useMedicalReport } from '../context/MedicalReportContext';
import { FileText, Calendar, Activity } from 'lucide-react';
import StatusBadge from '../components/ui/StatusBadge';

const HistoryPage = () => {
  const { reportHistory } = useMedicalReport();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen py-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Report History</h1>
          <p className="text-gray-600">View and manage your past medical reports</p>
        </div>

        <div className="space-y-6">
          {reportHistory.length > 0 ? (
            reportHistory.map((report) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
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
                              <StatusBadge status="normal" />
                              <StatusBadge status="borderline" />
                              <StatusBadge status="critical" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      className="px-4 py-2 bg-primary-50 text-primary-600 rounded-md hover:bg-primary-100 transition-colors"
                      onClick={() => {/* Handle view report */}}
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
    </motion.div>
  );
};

export default HistoryPage;