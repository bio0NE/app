
    import React from 'react';
    import { NavLink, Link } from 'react-router-dom';
    import { useToast } from "@/components/ui/use-toast";
    import { LayoutDashboard, ShieldCheck, Search, Sword, ShieldAlert, Bell, Eye, BookOpen, Sparkles, Cpu, Settings, MessageSquare as MessageSquareWarning, X, LogOut, Bot } from 'lucide-react';
    import { useAuth } from '@/contexts/SupabaseAuthContext';

    const navItems = [
      { name: 'Overview', icon: LayoutDashboard, path: '/dashboard' },
      { name: 'Wallet Scanner', icon: ShieldCheck, path: '/dashboard/wallet-scanner' },
      { name: 'Contract Verifier', icon: Search, path: '/dashboard/contract-verifier' },
      { name: 'Transaction Guard', icon: Sword, path: '/dashboard/transaction-guard' },
      { name: 'Rug Checker', icon: ShieldAlert, path: '/dashboard/rug-checker' },
      { name: 'Watchlist', icon: Bell, path: '/dashboard/watchlist' },
      { name: 'Phishing Detector', icon: Eye, path: '/dashboard/phishing-detector' },
      { name: 'Education', icon: BookOpen, path: '/dashboard/education' },
      { name: 'Solid Score', icon: Sparkles, path: '/dashboard/solid-score' },
      { name: 'Activity Monitor', icon: Cpu, path: '/dashboard/activity-monitor' },
      { name: 'AI Threat Advisor', icon: Bot, path: '/dashboard/ai-advisor', soon: true },
    ];

    const bottomNavItems = [
      { name: 'Settings', icon: Settings, path: '/dashboard/settings' },
      { name: 'Support / Report', icon: MessageSquareWarning, path: '/dashboard/support' },
    ];

    const NavItem = ({ item }) => {
        const content = (
          <>
            <item.icon className="h-5 w-5 mr-3" />
            <span className="flex-1">{item.name}</span>
            {item.soon && <span className="text-xs bg-solana-purple text-white px-2 py-0.5 rounded-full">Soon</span>}
          </>
        );

        const className = `flex items-center p-3 my-1 rounded-lg transition-colors duration-200`;
        const activeClassName = 'bg-solana-purple/20 text-solana-teal shadow-teal-glow';
        const inactiveClassName = 'text-gray-400 hover:bg-white/5 hover:text-white';
        
        return (
            <NavLink end to={item.path} className={({ isActive }) => `${className} ${isActive ? activeClassName : inactiveClassName}`}>
                {content}
            </NavLink>
        );
    };


    const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
      const { signOut } = useAuth();
      const { toast } = useToast();

      const handleSignOut = async () => {
        await signOut();
        toast({
            title: "Signed Out",
            description: "You have been successfully signed out.",
        });
      };

      return (
        <>
          <div className={`fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden ${sidebarOpen ? 'block' : 'hidden'}`} onClick={() => setSidebarOpen(false)}></div>
          <aside className={`fixed md:relative z-30 inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out w-64 bg-gray-900/80 backdrop-blur-lg border-r border-white/10 flex flex-col`}>
            <div className="flex items-center justify-between h-20 px-6 border-b border-white/10">
              <Link to="/dashboard" className="flex items-center space-x-2">
                <img
                src="/logotrans.png"
                alt="Solid Security"
                className="h-10 w-10 drop-shadow"
                whileHover={{ rotate: 6, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
                <span className="text-xl font-bold text-white">Solid Security</span>
              </Link>
              <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-white">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <nav className="flex-1 px-4 py-4 overflow-y-auto">
              {navItems.map((item) => <NavItem key={item.name} item={item} />)}
            </nav>
            
            <div className="px-4 py-4 border-t border-white/10">
              {bottomNavItems.map((item) => <NavItem key={item.name} item={item} />)}
               <button onClick={handleSignOut} className="flex items-center p-3 my-1 rounded-lg transition-colors duration-200 text-gray-400 hover:bg-red-500/20 hover:text-red-400 w-full">
                  <LogOut className="h-5 w-5 mr-3" />
                  <span>Sign Out</span>
              </button>
            </div>
          </aside>
        </>
      );
    };

    export default Sidebar;
  