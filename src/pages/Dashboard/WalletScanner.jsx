import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Search,
  Loader2,
  Wallet,
  Coins,
  Bug,
  Copy,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";

const WalletScanner = () => {
  const { toast } = useToast();
  const [address, setAddress] = useState("");
  const [network, setNetwork] = useState("mainnet-beta");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showDebug, setShowDebug] = useState(false);

  const handleScan = async (e) => {
    e.preventDefault();

    if (!address.trim()) {
      toast({
        variant: "destructive",
        title: "Wallet address is required ⚠️",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const data = await api.post("/scanWallet", {
        walletAddress: address.trim(),
        network,
      });

      if (!data) {
        toast({
          variant: "destructive",
          title: "No data returned ⚠️",
        });
        return;
      }

      setResult(data);
      toast({
        title: "Scan Complete ✅",
        description: `Wallet ${address.slice(0, 6)}... scanned successfully.`,
      });
    } catch (err) {
      console.error("Function call error:", err);
      toast({
        variant: "destructive",
        title: "Unexpected Error ⚠️",
        description: err.message || "Network or server error.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Wallet address copied to clipboard.",
    });
  };

  return (
    <>
      <Helmet>
        <title>Wallet Scanner | SOLSEC</title>
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700 solana-glow-teal">
            <ShieldCheck className="w-8 h-8 text-solana-green" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Wallet Scanner</h1>
            <p className="text-gray-400">
              Analyze any Solana wallet for SOL balance, token holdings, and
              network data (via Helius).
            </p>
          </div>
        </div>

        {/* Wallet Input */}
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

        {/* Results */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-8"
          >
            <Card className="glassmorphism">
              <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
                <CardTitle className="text-white">
                  Wallet:{" "}
                  <span className="font-mono text-sm text-gray-400 break-all">
                    {result.wallet}
                  </span>
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(result.wallet)}
                  className="mt-2 md:mt-0"
                >
                  <Copy className="w-4 h-4 mr-1" /> Copy
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-gray-900/50 rounded-lg">
                    <Wallet className="mx-auto text-solana-green w-6 h-6 mb-2" />
                    <p className="text-sm text-gray-400">SOL Balance</p>
                    <p className="text-2xl font-bold text-white">
                      {result.solBalance?.toFixed(4) ?? 0} SOL
                    </p>
                  </div>

                  <div className="p-4 bg-gray-900/50 rounded-lg">
                    <Coins className="mx-auto text-solana-blue w-6 h-6 mb-2" />
                    <p className="text-sm text-gray-400">Token Count</p>
                    <p className="text-2xl font-bold text-white">
                      {result.totalTokens ?? 0}
                    </p>
                  </div>

                  <div className="p-4 bg-gray-900/50 rounded-lg">
                    <Bug className="mx-auto text-solana-purple w-6 h-6 mb-2" />
                    <p className="text-sm text-gray-400">Network</p>
                    <p className="text-2xl font-bold text-white">
                      {result.network}
                    </p>
                  </div>
                </div>

                {/* Tokens list */}
                {result.tokens?.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-white text-lg font-semibold mb-3">
                      Token Holdings
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-gray-300 text-sm border border-gray-700/50 rounded-lg">
                        <thead className="bg-gray-800/50 text-gray-400 uppercase text-xs">
                          <tr>
                            <th className="px-4 py-2">Token Name</th>
                            <th className="px-4 py-2">Symbol</th>
                            <th className="px-4 py-2">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.tokens.map((t, i) => (
                            <tr
                              key={i}
                              className="border-t border-gray-700/50 hover:bg-gray-800/30"
                            >
                              <td className="px-4 py-2">
                                {t.tokenName || "Unknown"}
                              </td>
                              <td className="px-4 py-2">
                                {t.tokenSymbol || "—"}
                              </td>
                              <td className="px-4 py-2">
                                {Number(t.amount || 0).toFixed(3)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Debug Mode */}
                <div className="mt-6 text-center">
                  <Button
                    variant="outline"
                    onClick={() => setShowDebug(!showDebug)}
                    className="text-gray-300 border-gray-700 hover:bg-gray-800"
                  >
                    {showDebug ? "Hide Debug Info" : "Show Debug Info"}
                  </Button>
                </div>

                {showDebug && (
                  <pre className="mt-4 bg-gray-900/70 p-4 rounded-lg text-xs text-gray-400 overflow-x-auto">
                    {JSON.stringify(result.heliusAddressRaw, null, 2)}
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

export default WalletScanner;
