import { X, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import Button from './Button';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl: string;
}

const ShareModal = ({ isOpen, onClose, shareUrl }: ShareModalProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const url = new URL(shareUrl);
      url.searchParams.set('share', 'true');
      await navigator.clipboard.writeText(url.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!isOpen) return null;

  const displayUrl = new URL(shareUrl);
  displayUrl.searchParams.set('share', 'true');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Share Report</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-2">Share this link with others to view your report:</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-md p-3 text-sm text-gray-700 break-all">
              {displayUrl.toString()}
            </div>
            <Button
              variant="outline"
              onClick={handleCopy}
              className="whitespace-nowrap"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="text-sm text-gray-500">
          <p>Note: Anyone with this link can view your report.</p>
        </div>
      </div>
    </div>
  );
};

export default ShareModal; 