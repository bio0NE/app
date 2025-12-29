
import React from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = ({ setSidebarOpen }) => {
  return (
    <header className="flex-shrink-0 h-20 bg-gray-900/50 backdrop-blur-lg border-b border-white/10 flex items-center justify-between px-6">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(true)}
          className="md:hidden mr-4 text-gray-400 hover:text-white"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>
      <div className="flex items-center">
        <WalletMultiButton style={{ 
            backgroundColor: '#9945FF', 
            color: 'white', 
            borderRadius: '0.5rem',
            transition: 'background-color 0.3s',
         }} />
      </div>
    </header>
  );
};

export default Header;
