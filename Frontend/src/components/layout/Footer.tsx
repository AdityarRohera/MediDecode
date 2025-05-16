import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} MediDecode. All rights reserved.
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center">
            <span className="text-gray-500 text-sm flex items-center">
              Made with <Heart className="h-4 w-4 text-danger-500 mx-1" fill="currentColor" /> for better health insights
            </span>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="text-sm">Privacy</span>
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="text-sm">Terms</span>
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="text-sm">Contact</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;