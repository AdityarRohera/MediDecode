import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { MedicalReportProvider } from './context/MedicalReportContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LandingPage from './pages/LandingPage';
import UploadPage from './pages/UploadPage';
import ResultsPage from './pages/ResultsPage';
import HistoryPage from './pages/HistoryPage';
import { Suspense } from 'react';

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Router>
        <ThemeProvider>
          <MedicalReportProvider>
            <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
              <Navbar />
              <main className="flex-grow">
                <AnimatePresence mode="wait">
                  <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/upload" element={<UploadPage />} />
                    <Route path="/results/:reportId" element={<ResultsPage />} />
                    <Route path="/results" element={<ResultsPage />} />
                    <Route path="/history" element={<HistoryPage />} />
                  </Routes>
                </AnimatePresence>
              </main>
              <Footer />
            </div>
          </MedicalReportProvider>
        </ThemeProvider>
      </Router>
    </Suspense>
  );
}

export default App;