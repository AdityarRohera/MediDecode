import { Link } from 'react-router-dom';
import { FileText, Activity, Brain, Eye, List, Lock } from 'lucide-react';
import Button from '../components/ui/Button';

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="text-white">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Understand Your Health With AI-Powered Insights
              </h1>
              <p className="text-lg md:text-xl text-primary-100 mb-8">
                Upload your medical report and get instant AI analysis that breaks down complex health data into simple, actionable insights.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/upload">
                  <Button 
                    variant="secondary" 
                    size="lg"
                    className="w-full sm:w-auto shadow-lg hover:shadow-xl transform transition hover:-translate-y-1"
                  >
                    Upload Your Report
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="w-full sm:w-auto bg-white/10 border-white text-white hover:bg-white/20"
                >
                  Learn More
                </Button>
              </div>
            </div>
            <div className="hidden md:block relative">
              <div className="absolute inset-0 bg-white/10 rounded-2xl blur-3xl"></div>
              <div className="relative bg-white p-8 rounded-2xl shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <Activity className="h-6 w-6 text-primary-600 mr-2" />
                    <h3 className="font-semibold text-gray-900">Health Summary</h3>
                  </div>
                  <span className="bg-success-500 text-white text-xs px-2 py-1 rounded-full">AI Analyzed</span>
                </div>
                <div className="space-y-4">
                  <div className="p-3 bg-green-100 rounded-lg flex items-center">
                    <div className="p-2 bg-green-200 rounded-full mr-3">
                      <Activity className="h-5 w-5 text-success-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Kidney Function</p>
                      <p className="text-xs text-green-800">All values normal</p>
                    </div>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-lg flex items-center">
                    <div className="p-2 bg-yellow-200 rounded-full mr-3">
                      <Activity className="h-5 w-5 text-warning-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Liver Function</p>
                      <p className="text-xs text-yellow-800">ALT slightly elevated</p>
                    </div>
                  </div>
                  <div className="p-3 bg-red-100 rounded-lg flex items-center">
                    <div className="p-2 bg-red-200 rounded-full mr-3">
                      <Activity className="h-5 w-5 text-danger-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Pancreatic Function</p>
                      <p className="text-xs text-red-800">Lipase critically elevated</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How MediDecode Works</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our AI technology transforms complex medical data into clear, actionable insights that help you understand your health better.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="bg-primary-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload Your Report</h3>
              <p className="text-gray-600">
                Simply upload your medical report in PDF or image format. Our system accepts lab tests from any provider.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="bg-primary-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Analysis</h3>
              <p className="text-gray-600">
                Our advanced AI extracts and analyzes your test results, comparing them to medical reference ranges.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="bg-primary-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Eye className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Get Clear Insights</h3>
              <p className="text-gray-600">
                Receive an organized, easy-to-understand dashboard of your health status with AI-powered explanations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose MediDecode</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We're revolutionizing how people understand their medical data
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="flex">
              <div className="mr-4 mt-1">
                <List className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Organized by Organ System
                </h3>
                <p className="text-gray-600">
                  Instead of a confusing list of test results, we group your data by body system, making it easier to understand your overall health status.
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className="mr-4 mt-1">
                <Lock className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Secure & Private
                </h3>
                <p className="text-gray-600">
                  Your health data is sensitive information. We use bank-level encryption and never store your reports after analysis.
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className="mr-4 mt-1">
                <Brain className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  AI-Powered Explanations
                </h3>
                <p className="text-gray-600">
                  Get clear explanations of abnormal results in plain language. Understand what your test results actually mean for your health.
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className="mr-4 mt-1">
                <Activity className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Visual Health Dashboard
                </h3>
                <p className="text-gray-600">
                  Our color-coded status indicators make it easy to spot areas of concern at a glance, empowering you to take control of your health.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to decode your medical report?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Upload your report now to get instant insights into your health status.
          </p>
          <Link to="/upload">
            <Button 
              variant="primary" 
              size="lg"
              className="shadow-lg hover:shadow-xl transform transition hover:-translate-y-1"
            >
              Upload Your Report
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;