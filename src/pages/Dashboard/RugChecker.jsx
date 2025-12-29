import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Search,
  Loader2,
  Wallet,
  AlertTriangle,
  Activity,
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dialog } from '@headlessui/react';
import { supabase } from '@/lib/supabaseClient';

const WalletScanner = () => {
  const { toast } = useToast();
  const [address, setAddress] = useState('');
  const [network, setNetwork] = useState('mainnet-beta');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showDebug, setShowDebug] = useState(false);
  const [isOwnerModalOpen, setIsOwnerModalOpen] = useState(false);

  // --- Main function to call Supabase Edge Function ---
  const handleScan = async (e) => {
    e.preventDefault();

    if (!address.trim()) {
      toast({
        variant: 'destructive',
        title: 'Wallet address is required ⚠️',
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('scanWallet', {
        body: { address: address.trim(), network },
      });

      if (error) {
        console.error('Supabase function error:', error);
        toast({
          variant: 'destructive',
          title: 'Scan Failed ❌',
          description: error.message || 'Failed to connect to scan service.',
        });
        setResult({
          address: address.trim(),
          analysis: { solBalance: 0, txCount: 0, flags: [] },
          score: 0,
        });
        return;
      }

      if (!data || !data.analysis) {
        toast({
          title: 'Wallet Found 🪙',
          description: 'Wallet is valid but has no transactions or SOL balance.',
        });
        setResult({
          address: address.trim(),
          analysis: { solBalance: 0, txCount: 0, flags: [] },
          score: 0,
        });
        return;
      }

      setResult(data);
      toast({
        title: 'Scan Complete ✅',
        description: `Wallet ${address.slice(0, 6)}... scanned successfully.`,
      });
    } catch (err) {
      console.error('Function call error:', err);
      toast({
        variant: 'destructive',
        title: 'Unexpected Error ⚠️',
        description: err.message || 'Network or server error.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Wallet Scanner | Solid Security</title>
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* --- Header --- */}
        <div className="flex items-center space-x-4 mb-8">
          <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700 solana-glow-teal">
            <ShieldCheck className="w-8 h-8 text-solana-green" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Wallet Scanner</h1>
            <p className="text-gray-400">
              Analyze any Solana wallet for balance, activity, and risk factors (powered by Helius).
            </p>
          </div>
        </div>

        {/* --- Wallet Scan Form --- */}
        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle className="text-white">Scan a Wallet Address</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleScan}
              className="flex flex-col sm:flex-row items-center gap-4"
            >
              <Input
                placeholder="Enter Solana wallet address..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="bg-gray-900/70 border-gray-700 text-white focus:solana-glow-purple"
              />
              <div className="flex w-full sm:w-auto gap-2">
                <Select value={network} onValueChange={setNetwork}>
                  <SelectTrigger className="w-full sm:w-[140px] bg-gray-900/70 border-gray-700 text-white focus:solana-glow-purple">
                    <SelectValue placeholder="Select Network" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mainnet-beta">Mainnet</SelectItem>
                    <SelectItem value="devnet">Devnet</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto bg-solana-purple hover:bg-solana-purple/90 font-bold solana-glow-purple"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Search className="w-5 h-5" />
                  )}
                  <span className="ml-2">Scan</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* --- Scan Results --- */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-8"
          >
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle className="text-white">
                  Scan Result:{' '}
                  <span className="font-mono text-sm text-gray-400 break-all">
                    {result.address}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* --- Wallet Summary --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-gray-900/50 rounded-lg">
                    <Wallet className="mx-auto text-solana-green w-6 h-6 mb-2" />
                    <p className="text-sm text-gray-400">Balance</p>
                    <p className="text-2xl font-bold text-white">
                      {result.analysis?.solBalance ?? 0} SOL
                    </p>
                  </div>

                  <div className="p-4 bg-gray-900/50 rounded-lg">
                    <Activity className="mx-auto text-solana-blue w-6 h-6 mb-2" />
                    <p className="text-sm text-gray-400">Transactions</p>
                    <p className="text-2xl font-bold text-white">
                      {result.analysis?.txCount ?? 0}
                    </p>
                  </div>

                  <div className="p-4 bg-gray-900/50 rounded-lg">
                    <ShieldCheck className="mx-auto text-solana-purple w-6 h-6 mb-2" />
                    <p className="text-sm text-gray-400">Security Score</p>
                    <p className="text-2xl font-bold text-white">
                      {result.score ?? 0}/100
                    </p>
                  </div>
                </div>

                {/* --- Debug Info Section --- */}
                <div className="mt-6 text-center">
                  <Button
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                    onClick={() => setShowDebug(!showDebug)}
                  >
                    {showDebug ? 'Hide Debug Info' : 'Show Debug Info'}
                  </Button>
                </div>

                {showDebug && (
                  <pre className="mt-4 bg-gray-900/70 text-gray-300 p-3 rounded-lg text-xs overflow-x-auto border border-gray-800">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                )}

                {/* --- See More Button (opens modal) --- */}
                <div className="mt-6 text-center">
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 font-semibold"
                    onClick={() => setIsOwnerModalOpen(true)}
                  >
                    See More
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>

      {/* --- Subscribe Modal --- */}
      <Dialog
        open={isOwnerModalOpen}
        onClose={() => setIsOwnerModalOpen(false)}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      >
        <Dialog.Panel className="bg-gray-900 p-6 rounded-lg max-w-sm w-full text-center">
          <Dialog.Title className="text-xl font-bold mb-4 text-white">
            Subscribe Required
          </Dialog.Title>
          <Dialog.Description className="text-gray-300 mb-6">
            To see detailed owner behavior, you need to subscribe.
          </Dialog.Description>
          <Button
            className="bg-blue-600 hover:bg-blue-700 w-full"
            onClick={() => toast({ title: 'Subscription clicked!' })}
          >
            Subscribe Now
          </Button>
          <Button
            className="mt-3 w-full bg-gray-700 hover:bg-gray-600"
            onClick={() => setIsOwnerModalOpen(false)}
          >
            Close
          </Button>
        </Dialog.Panel>
      </Dialog>
    </>
  );
};

export default WalletScanner;
