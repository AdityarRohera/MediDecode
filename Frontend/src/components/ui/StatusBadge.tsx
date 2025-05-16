import { StatusBadgeProps } from '../../types';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const statusConfig = {
    normal: {
      text: 'Normal',
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      icon: <CheckCircle className="w-4 h-4 mr-1 text-success-500" />,
    },
    borderline: {
      text: 'Borderline',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      icon: <AlertCircle className="w-4 h-4 mr-1 text-warning-500" />,
    },
    critical: {
      text: 'Critical',
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
      icon: <XCircle className="w-4 h-4 mr-1 text-danger-500" />,
    },
  };

  const { text, bgColor, textColor, icon } = statusConfig[status];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {icon}
      {text}
    </span>
  );
};

export default StatusBadge;