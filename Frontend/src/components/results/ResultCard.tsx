import { useState } from 'react';
import { ResultCardProps } from '../../types';
import StatusBadge from '../ui/StatusBadge';
import { ChevronDown, ChevronUp, Activity, HelpCircle } from 'lucide-react';

const ResultCard = ({ organSystem }: ResultCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleExplanation = (testId: string) => {
    setShowExplanation(prev => ({
      ...prev,
      [testId]: !prev[testId],
    }));
  };

  const getIconComponent = () => {
    // Simple icon mapping - in a real app, you would have SVG icons for each organ
    return <Activity className="h-6 w-6" />;
  };

  const getStatusColor = (status: 'normal' | 'borderline' | 'critical') => {
    const colors = {
      normal: 'text-success-500',
      borderline: 'text-warning-500',
      critical: 'text-danger-500',
    };
    return colors[status];
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200">
      <div 
        className="px-6 py-4 cursor-pointer"
        onClick={toggleExpand}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${getStatusColor(organSystem.status)} bg-opacity-10`}>
              {getIconComponent()}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {organSystem.name}
              </h3>
              <div className="mt-1">
                <StatusBadge status={organSystem.status} />
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
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2">Test</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2">Result</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2">Reference</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {organSystem.tests.map((test) => (
                  <React.Fragment key={test.id}>
                    <tr className={`hover:bg-gray-50 ${test.status !== 'normal' ? 'bg-opacity-10' : ''}`}>
                      <td className="py-3 text-sm font-medium text-gray-900">{test.name}</td>
                      <td className="py-3 text-sm text-gray-900">{test.value} {test.unit}</td>
                      <td className="py-3 text-sm text-gray-500">{test.referenceRange}</td>
                      <td className="py-3 text-sm">
                        <div className="flex items-center">
                          <StatusBadge status={test.status} />
                          {test.explanation && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleExplanation(test.id);
                              }}
                              className="ml-2 text-gray-400 hover:text-gray-600"
                              aria-label="Toggle explanation"
                            >
                              <HelpCircle className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                    {test.explanation && showExplanation[test.id] && (
                      <tr>
                        <td colSpan={4} className="py-3 px-4 bg-gray-50">
                          <div className="text-sm text-gray-700 italic border-l-2 border-primary-500 pl-3">
                            <p className="font-medium text-primary-700 mb-1">AI Explanation:</p>
                            {test.explanation}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultCard;