
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import '@/index.css';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/SupabaseAuthContext';
import { WalletProvider } from '@/contexts/WalletProvider';
import '@solana/wallet-adapter-react-ui/styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <BrowserRouter>
        <WalletProvider>
          <AuthProvider>
            <App />
            <Toaster />
          </AuthProvider>
        </WalletProvider>
    </BrowserRouter>
  </>
);
