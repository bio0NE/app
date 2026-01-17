import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Search,
  Loader2,
  AlertTriangle,
  Activity,
  Coins,
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
import { api } from '@/lib/api';

const RugChecker = () => {
  const { toast } = useToast();
  const [address, setAddress] = useState('');
  const [network, setNetwork] = useState('mainnet-beta');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showDebug, setShowDebug] = useState(false);
  const [isOwnerModalOpen, setIsOwnerModalOpen] = useState(false);

  // --- Main function to call API ---
  const handleScan = async (e) => {
    e.preventDefault();

    if (!address.trim()) {
      toast({
        variant: 'destructive',
        title: 'Token address is required ⚠️',
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const tokenData = await api.post('/getTokenData', {
        address: address.trim(),
        network
      });

      if (!tokenData) {
        toast({
          title: 'Token Not Found ⚠️',
          description: 'Could not fetch token data.',
        });
        return;
      }

      // Get AI analysis
      const aiRes = await api.post('/analyzeTokenAI', {
        ...tokenData
      });

      setResult({ ...tokenData, aiResult: aiRes.aiResult });

      toast({
        title: 'Scan Complete ✅',
        description: `Token ${tokenData.symbol || address.slice(0, 6)} analyzed.`,
      });
    } catch (err) {
      console.error('API call error:', err);
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
        <title>Rug Checker | Solid Security</title>
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* --- Header --- */}
        <div className="flex items-center space-x-4 mb-8">
          <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700 solana-glow-teal">
            <AlertTriangle className="w-8 h-8 text-solana-green" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Rug Checker</h1>
            <p className="text-gray-400">
              Analyze any Solana token for rug pull indicators and liquidity risks.
            </p>
          </div>
        </div>

        {/* --- Scan Form --- */}
        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle className="text-white">Check a Token Address</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleScan}
              className="flex flex-col sm:flex-row items-center gap-4"
            >
              <Input
                placeholder="Enter Solana token address..."
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
                  <span className="ml-2">Check</span>
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
                  Result: <span className="text-solana-green">{result.name} ({result.symbol})</span>
                </CardTitle>
                <div className="text-sm text-gray-400 font-mono mt-1">{result.address}</div>
              </CardHeader>
              <CardContent>
                {/* --- Summary --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-gray-900/50 rounded-lg">
                    <Coins className="mx-auto text-solana-green w-6 h-6 mb-2" />
                    <p className="text-sm text-gray-400">Liquidity</p>
                    <p className="text-2xl font-bold text-white">
                      ${result.liquidityUsd?.toLocaleString() ?? 0}
                    </p>
                  </div>

                  <div className="p-4 bg-gray-900/50 rounded-lg">
                    <Activity className="mx-auto text-solana-blue w-6 h-6 mb-2" />
                    <p className="text-sm text-gray-400">24h Volume</p>
                    <p className="text-2xl font-bold text-white">
                      ${result.volume24h?.toLocaleString() ?? 0}
                    </p>
                  </div>

                  <div className="p-4 bg-gray-900/50 rounded-lg">
                    <ShieldCheck className="mx-auto text-solana-purple w-6 h-6 mb-2" />
                    <p className="text-sm text-gray-400">Trust Score</p>
                    <p className={`text-2xl font-bold ${result.aiResult?.score > 70 ? 'text-green-500' : 'text-red-500'}`}>
                      {result.aiResult?.score ?? 0}/100
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
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </>
  );
};

export default RugChecker;
