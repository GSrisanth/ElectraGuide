import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import TopNav from './components/TopNav';
import FloatingChat from './components/FloatingChat';

import HomeDashboard from './pages/HomeDashboard';
import TimelineSection from './pages/TimelineSection';
import TermsSection from './pages/TermsSection';
import EligibilitySection from './pages/EligibilitySection';
import VotingDaySection from './pages/VotingDaySection';
import QuizSection from './pages/QuizSection';
import LeadersSection from './pages/LeadersSection';
import EVMSimulator from './pages/EVMSimulator';
import LivePollsSection from './pages/LivePollsSection';

function AppLayout() {
  const location = useLocation();
  const isHome = location.pathname === '/' || location.pathname === '/home';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/40 py-8 px-4 sm:px-6 font-sans text-gray-900 dark:text-gray-100 w-full flex items-center justify-center transition-colors duration-500">
      <div className="w-full max-w-4xl">
        <main className="animate-fade-in w-full">
          {isHome ? (
            <Routes>
              <Route path="/*" element={<HomeDashboard />} />
            </Routes>
          ) : (
            <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm rounded-3xl p-4 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-white/60 dark:border-slate-700/50">
              <TopNav />
              <div className="animate-slide-up mt-8 relative min-h-[400px]">
                <Routes>
                  <Route path="/timeline" element={<TimelineSection />} />
                  <Route path="/terms" element={<TermsSection />} />
                  <Route path="/eligibility" element={<EligibilitySection />} />
                  <Route path="/votingday" element={<VotingDaySection />} />
                  <Route path="/quiz" element={<QuizSection />} />
                  <Route path="/leaders" element={<LeadersSection />} />
                  <Route path="/evm" element={<EVMSimulator />} />
                  <Route path="/polls" element={<LivePollsSection />} />
                </Routes>
              </div>
            </div>
          )}
        </main>
      </div>
      <FloatingChat />
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-up { animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}} />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
