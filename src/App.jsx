
    import React from 'react';
    import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
    import { AnimatePresence } from 'framer-motion';
    import LandingPage from '@/pages/LandingPage';
    import DashboardLayout from '@/pages/Dashboard/DashboardLayout';
    import DashboardOverview from '@/pages/Dashboard/DashboardOverview';
    import WalletScanner from '@/pages/Dashboard/WalletScanner';
    import ContractVerifier from '@/pages/Dashboard/ContractVerifier';
    import TransactionGuard from '@/pages/Dashboard/TransactionGuard';
    import RugChecker from '@/pages/Dashboard/RugChecker';
    import Watchlist from '@/pages/Dashboard/Watchlist';
    import PhishingDetector from '@/pages/Dashboard/PhishingDetector';
    import Education from '@/pages/Dashboard/Education';
    import SolidScore from '@/pages/Dashboard/SolidScore';
    import ActivityMonitor from '@/pages/Dashboard/ActivityMonitor';
    import AiAdvisor from '@/pages/Dashboard/AiAdvisor';
    import Settings from '@/pages/Dashboard/Settings';
    import Support from '@/pages/Dashboard/Support';
    import AuthPage from '@/pages/AuthPage';

    function App() {
      const location = useLocation();

      return (
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardOverview />} />
              <Route path="wallet-scanner" element={<WalletScanner />} />
              <Route path="contract-verifier" element={<ContractVerifier />} />
              <Route path="transaction-guard" element={<TransactionGuard />} />
              <Route path="rug-checker" element={<RugChecker />} />
              <Route path="watchlist" element={<Watchlist />} />
              <Route path="phishing-detector" element={<PhishingDetector />} />
              <Route path="education" element={<Education />} />
              <Route path="solid-score" element={<SolidScore />} />
              <Route path="activity-monitor" element={<ActivityMonitor />} />
              <Route path="ai-advisor" element={<AiAdvisor />} />
              <Route path="settings" element={<Settings />} />
              <Route path="support" element={<Support />} />
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AnimatePresence>
      );
    }

    export default App;
  