import { useState } from 'react';
import { ResultCardProps, StatusType } from '../../types';
import StatusBadge from '../ui/StatusBadge';
import { ChevronDown, ChevronUp, Activity } from 'lucide-react';

const ResultCard = ({ organResult }: ResultCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const getIconComponent = () => {
    return <Activity className="h-6 w-6" />;
  };

  const getStatusColor = (status: StatusType) => {
    const colors = {
      Normal: 'text-success-500',
      Borderline: 'text-warning-500',
      Critical: 'text-danger-500',
    };
    return colors[status];
  };

  const handleConsultDoctor = () => {
    // TODO: Implement doctor consultation flow
    console.log('Consult doctor clicked for:', organResult.organ);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200">
      <div 
        className="px-6 py-4 cursor-pointer"
        onClick={toggleExpand}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${getStatusColor(organResult.status)} bg-opacity-10`}>
              {getIconComponent()}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {organResult.organ}
              </h3>
              <div className="mt-1">
                <StatusBadge status={organResult.status} />
              </div>
            </div>
          </div>
          <button 
            className="text-gray-500 hover:text-gray-700"
            aria-expanded={isExpanded}
            aria-label={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="px-6 pb-4">
          <div className="border-t border-gray-200 pt-4">
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Test Details</h4>
              <div className="mt-2 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Test Name</p>
                  <p className="text-sm font-medium text-gray-900">{organResult.extractionFromReport.testName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Result</p>
                  <p className="text-sm font-medium text-gray-900">
                    {organResult.extractionFromReport.resultValue} {organResult.extractionFromReport.unitOfMeasurement}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Expected Range</p>
                  <p className="text-sm font-medium text-gray-900">{organResult.extractionFromReport.expectedRange}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="text-sm font-medium text-gray-900">
                    <StatusBadge status={organResult.status} />
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-start">
                <div className="text-sm text-gray-700 italic border-l-2 border-primary-500 pl-3 flex-1">
                  <p className="font-medium text-primary-700 mb-1">Explanation:</p>
                  {organResult.explanation}
                </div>
                {organResult.status === 'Critical' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleConsultDoctor();
                    }}
                    className="ml-4 px-4 py-2 bg-danger-500 text-white rounded-md hover:bg-danger-600 transition-colors duration-200 text-sm font-medium whitespace-nowrap"
                  >
                    Consult a Doc Now
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultCard;