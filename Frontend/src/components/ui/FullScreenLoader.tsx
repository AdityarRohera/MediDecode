import { Loader2 } from 'lucide-react';

interface FullScreenLoaderProps {
  message?: string;
}

const FullScreenLoader = ({ message = 'Processing your report...' }: FullScreenLoaderProps) => {
  return (
    <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <Loader2 className="h-12 w-12 text-primary-600 dark:text-primary-400 animate-spin" />
          <div className="absolute inset-0 bg-white/20 dark:bg-gray-900/20 rounded-full blur-xl animate-pulse" />
        </div>
        <p className="text-lg font-medium text-gray-900 dark:text-white">{message}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">This may take a few moments</p>
      </div>
    </div>
  );
};

export default FullScreenLoader; 