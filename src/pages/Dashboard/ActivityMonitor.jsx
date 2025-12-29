
import React, { useState, useEffect } from 'react';
    import { Helmet } from 'react-helmet';
    import { motion } from 'framer-motion';
    import { Cpu, Wallet, History, Loader2, AlertTriangle } from 'lucide-react';
    import { useAuth } from '@/contexts/SupabaseAuthContext';
    import { useConnection, useWallet } from '@solana/wallet-adapter-react';
    import { LAMPORTS_PER_SOL } from '@solana/web3.js';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { useToast } from '@/components/ui/use-toast';

    const ActivityMonitor = () => {
      const { user } = useAuth();
      const { publicKey, connected } = useWallet();
      const { connection } = useConnection();
      const { toast } = useToast();

      const [isLoading, setIsLoading] = useState(false);
      const [data, setData] = useState(null);

      const fetchWalletData = async () => {
        if (!connected || !publicKey) {
          toast({
            variant: 'destructive',
            title: 'Wallet not connected',
            description: 'Please connect your wallet to view your activity.',
          });
          return;
        }
        setIsLoading(true);
        setData(null);
        try {
          const balance = await connection.getBalance(publicKey);
          const transactions = await connection.getSignaturesForAddress(publicKey, { limit: 5 });

          setData({
            balance: (balance / LAMPORTS_PER_SOL).toFixed(4),
            transactions,
          });
        } catch (error) {
          console.error("Failed to fetch wallet data:", error);
          toast({
            variant: 'destructive',
            title: 'Failed to fetch data',
            description: 'Could not retrieve your wallet activity from the blockchain.',
          });
        } finally {
          setIsLoading(false);
        }
      };

      return (
        <>
          <Helmet>
            <title>Activity Monitor | Solid Security</title>
          </Helmet>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center space-x-4 mb-8">
                <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700 solana-glow-teal">
                    <Cpu className="w-8 h-8 text-solana-green" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white">Wallet Activity Monitor</h1>
                    <p className="text-gray-400">View your wallet's balance and recent transactions.</p>
                </div>
            </div>

            {!connected ? (
              <Card className="glassmorphism text-center">
                <CardHeader>
                  <CardTitle className="text-yellow-400 flex items-center justify-center gap-2"><AlertTriangle /> Wallet Not Connected</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">Please connect your wallet to monitor your on-chain activity.</p>
                </CardContent>
              </Card>
            ) : (
              <>
                <Card className="glassmorphism mb-8">
                  <CardContent className="pt-6">
                    <Button onClick={fetchWalletData} disabled={isLoading} className="w-full bg-solana-purple hover:bg-solana-purple/90 font-bold solana-glow-purple">
                      {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Fetch My Wallet Activity'}
                    </Button>
                  </CardContent>
                </Card>

                {isLoading && (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="w-8 h-8 text-solana-purple animate-spin" />
                        <p className="ml-4 text-white">Fetching your wallet data...</p>
                    </div>
                )}

                {data && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="glassmorphism-light">
                        <CardHeader className="flex-row items-center gap-4">
                          <Wallet className="w-8 h-8 text-solana-green" />
                          <CardTitle className="text-white">Current Balance</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-3xl font-bold text-white">{data.balance} SOL</p>
                        </CardContent>
                      </Card>
                      <Card className="glassmorphism-light">
                        <CardHeader className="flex-row items-center gap-4">
                          <History className="w-8 h-8 text-solana-green" />
                          <CardTitle className="text-white">Recent Transactions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {data.transactions.length > 0 ? data.transactions.map(tx => (
                            <div key={tx.signature} className="p-2 bg-gray-900/50 rounded-md">
                              <p className="text-xs font-mono text-gray-400 truncate">{tx.signature}</p>
                              <p className="text-xs text-gray-500">{new Date(tx.blockTime * 1000).toLocaleString()}</p>
                            </div>
                          )) : <p className="text-gray-400">No recent transactions found.</p>}
                        </CardContent>
                      </Card>
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </motion.div>
        </>
      );
    };

    export default ActivityMonitor;
