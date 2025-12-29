
    import React, { useState, useEffect } from 'react';
    import { Outlet, useLocation, useNavigate } from 'react-router-dom';
    import { AnimatePresence, motion } from 'framer-motion';
    import Sidebar from '@/components/dashboard/Sidebar';
    import Header from '@/components/dashboard/Header';
    import { useAuth } from '@/contexts/SupabaseAuthContext';

    const DashboardLayout = () => {
      const [sidebarOpen, setSidebarOpen] = useState(false);
      const location = useLocation();
      const navigate = useNavigate();
      const { user, loading } = useAuth();

      useEffect(() => {
        if (!loading && !user) {
          navigate('/auth');
        }
      }, [user, loading, navigate]);
      
      if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-solana-black">
                <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-solana-purple"></div>
            </div>
        )
      }

      if (!user) {
        return null;
      }

      return (
        <div className="flex h-screen bg-solana-black text-gray-200">
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header setSidebarOpen={setSidebarOpen} />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-solana-black">
            <div
              className={`flex-1 overflow-x-hidden overflow-y-auto bg-solana-black ${
                location.pathname === '/dashboard/phishing-detector'
                  ? 'px-0 py-0'   // Full-width for PhishingDetector
                  : 'px-6 py-8'   // Normal padding for other pages
              }`}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Outlet />
                </motion.div>
              </AnimatePresence>
            </div>
            </main>
          </div>
        </div>
      );
    };

    export default DashboardLayout;
  