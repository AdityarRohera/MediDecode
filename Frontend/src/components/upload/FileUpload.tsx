import { useState, useRef } from 'react';
import { FileUploadProps } from '../../types';
import { Upload, File } from 'lucide-react';
import Button from '../ui/Button';

const FileUpload = ({ onFileSelect, isLoading }: FileUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  const openFileSelector = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 
          ${dragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300'} 
          transition-colors duration-150 ease-in-out`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileInput}
        />
        
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-900">
              Drag and drop your medical report here
            </p>
            <p className="mt-1 text-xs text-gray-500">
              PDF, JPG or PNG up to 10MB
            </p>
          </div>
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            className="mt-4"
            onClick={openFileSelector}
          >
            Browse Files
          </Button>
        </div>
      </div>

      {selectedFile && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <File className="h-6 w-6 text-gray-400 mr-2" />
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-gray-900 truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-gray-500">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="primary"
            className="w-full mt-4"
            onClick={handleUpload}
            isLoading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Upload & Analyze'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;