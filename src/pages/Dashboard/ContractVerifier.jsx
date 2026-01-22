import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { FileCheck2, Search, Loader2, Rocket, Brain } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { api } from '@/lib/api';

const ContractVerifier = () => {
  const { toast } = useToast();
  const [address, setAddress] = useState('');
  const [network, setNetwork] = useState('mainnet-beta');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleScan = async (e) => {
    e.preventDefault();
    if (!address.trim()) {
      return toast({ variant: 'destructive', title: 'Contract Address required' });
    }

    setIsLoading(true);
    setResult(null);

    try {
      // --- Fetch token data ---
      const tokenData = await api.post('/getTokenData', {
        address: address.trim(),
        network,
      });

      if (!tokenData) throw new Error('No token data returned');

      // --- Analyze token with AI ---
      const aiData = await api.post('/analyzeTokenAI', {
        ...tokenData,
      });

      if (!aiData) throw new Error('AI analysis returned no data');

      // --- Set unified result ---
      // Backend now returns flat numbers, so toFixed() is safe
      setResult({
        address: address.trim(),
        network,

        // token info
        name: tokenData.name || 'Unknown Token',
        price: tokenData.price || 0,
        marketCap: tokenData.marketCap || 0,
        liquidity: tokenData.liquidityUsd || 0,
        volume: tokenData.volume24h || 0,
        solBalance: tokenData.solBalance || 0,

        pumpfunLink: tokenData.pumpfun_link || null,

        // AI
        aiResult: aiData.aiResult,
      });


      toast({
        title: 'Analysis Complete ✅',
        description: `AI Score: ${aiData.aiResult?.score ?? 0}/100`,
      });
    } catch (err) {
      console.error('Verification error:', err);
      toast({
        variant: 'destructive',
        title: 'Verification Failed',
        description: err.message || 'An unexpected error occurred.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Contract Verifier | Solid Security</title></Helmet>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center space-x-4 mb-8">
          <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700 solana-glow-teal">
            <FileCheck2 className="w-8 h-8 text-solana-green" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Contract Verifier</h1>
            <p className="text-gray-400">
              Check token addresses for common red flags and get an AI-powered security score.
            </p>
          </div>
        </div>

        <Card className="glassmorphism">
          <CardHeader><CardTitle className="text-white">Verify Contract</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleScan} className="flex flex-col sm:flex-row items-center gap-4">
              <Input
                placeholder="Enter contract address..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="bg-gray-900/70 border-gray-700 text-white flex-grow focus:solana-glow-purple"
              />
              <div className="flex w-full sm:w-auto gap-2">
                <Select value={network} onValueChange={setNetwork}>
                  <SelectTrigger className="w-full sm:w-[160px] bg-gray-900/70 border-gray-700 text-white focus:solana-glow-purple">
                    <SelectValue placeholder="Select Network" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mainnet-beta">Solana Mainnet</SelectItem>
                    <SelectItem value="devnet">Devnet</SelectItem>
                    <SelectItem value="pumpfun">Pump.fun</SelectItem>
                  </SelectContent>
                </Select>

                <Button type="submit" disabled={isLoading} className="w-full sm:w-auto bg-solana-purple hover:bg-solana-purple/90 font-bold solana-glow-purple">
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                  <span className="ml-2">Verify</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {result && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
            <Card className="glassmorphism border-t-4 border-solana-green">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span>{result.name}</span>
                  <Rocket className="text-solana-green" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-white">
                <div className="flex justify-between p-3 bg-gray-900/50 rounded-lg">
                  <span className="text-gray-400">Price</span>
                  <span>${result.price.toFixed(8)}</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-900/50 rounded-lg">
                  <span className="text-gray-400">Market Cap</span>
                  <span>${result.marketCap.toLocaleString()}</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-900/50 rounded-lg">
                  <span className="text-gray-400">Liquidity</span>
                  <span>${result.liquidity.toLocaleString()}</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-900/50 rounded-lg">
                  <span className="text-gray-400">24h Volume</span>
                  <span>${result.volume.toLocaleString()}</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-900/50 rounded-lg">
                  <span className="text-gray-400">SOL Balance</span>
                  <span>{result.solBalance.toFixed(6)} SOL</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-900/50 rounded-lg">
                  <span className="text-gray-400">Pump Score</span>
                  <span className={`font-bold ${result.aiResult?.score > 70 ? 'text-solana-green' : 'text-yellow-400'}`}>
                    {result.aiResult?.score}/100
                  </span>
                </div>
                {result.aiResult?.reason && (
                  <div className="p-4 bg-blue-900/40 rounded-lg text-blue-200 flex items-start">
                    <Brain className="w-5 h-5 mr-3 mt-1 text-blue-300 flex-shrink-0" />
                    <p className="text-sm">{result.aiResult.reason}</p>
                  </div>
                )}
                {result.pumpfunLink && (
                  <a
                    href={result.pumpfunLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center mt-4 text-solana-green font-semibold hover:underline"
                  >
                    View on Pump.fun →
                  </a>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </>
  );
};

export default ContractVerifier;