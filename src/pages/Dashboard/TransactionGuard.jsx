import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import {
  Search,
  Loader2,
  ExternalLink,
  AlertCircle,
  Wallet,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const TransactionGuard = () => {
  const { toast } = useToast();
  const [walletAddress, setWalletAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const handleScan = async (e) => {
    e.preventDefault();
    if (!walletAddress.trim()) {
      toast({
        variant: "destructive",
        title: "Wallet address is required",
      });
      return;
    }

    setIsLoading(true);
    setTransactions([]);

    try {
      // ✅ Call Supabase Edge Function (transactionExplorer)
      const { data, error } = await supabase.functions.invoke(
        "transactionExplorer",
        {
          body: { address: walletAddress.trim() },
        }
      );

      if (error) throw error;
      if (!data || !data.transactions)
        throw new Error("No transactions found.");

      setTransactions(data.transactions);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      toast({
        variant: "destructive",
        title: "Failed to fetch transactions",
        description: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Transaction Explorer | SOLSEC</title>
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="pb-12"
      >
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
            <Wallet className="w-8 h-8 text-solana-green" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">
              Transaction Explorer
            </h1>
            <p className="text-gray-400">
              View recent Solana transactions for any wallet address.
            </p>
          </div>
        </div>

        {/* Search Card */}
        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle className="text-white">
              Fetch Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleScan}
              className="flex flex-col sm:flex-row items-center gap-4"
            >
              <Input
                placeholder="Enter Solana wallet address..."
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="bg-gray-900/70 border-gray-700 text-white flex-grow focus:solana-glow-purple"
              />
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
                <span className="ml-2 hidden sm:inline">Fetch</span>
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 text-solana-purple animate-spin" />
            <p className="ml-4 text-white">Fetching transactions...</p>
          </div>
        )}

        {/* Results */}
        {!isLoading && transactions.length > 0 && (
          <Card className="mt-8 glassmorphism-light border-t-4 border-green-500">
            <CardHeader>
              <CardTitle className="text-white">
                Recent Transactions ({transactions.length})
              </CardTitle>
            </CardHeader>

            <CardContent className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-300">
                <thead className="bg-gray-800/70 text-gray-400 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-2">Hash</th>
                    <th className="px-4 py-2">From</th>
                    <th className="px-4 py-2">To</th>
                    <th className="px-4 py-2 text-right">Amount (SOL)</th>
                    <th className="px-4 py-2 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-700/50 hover:bg-gray-800/50"
                    >
                      <td className="px-4 py-2 font-mono text-xs">
                        <a
                          href={`https://explorer.solana.com/tx/${tx.signature}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline flex items-center gap-1"
                        >
                          {tx.signature.slice(0, 12)}...{" "}
                          <ExternalLink size={12} />
                        </a>
                      </td>
                      <td className="px-4 py-2 font-mono text-xs break-all">
                        {tx.from}
                      </td>
                      <td className="px-4 py-2 font-mono text-xs break-all">
                        {tx.to}
                      </td>
                      <td className="px-4 py-2 text-right font-semibold text-green-400">
                        {tx.amount?.toFixed(6)}
                      </td>
                      <td className="px-4 py-2 text-right">
                        {tx.timestamp
                          ? new Date(tx.timestamp).toLocaleString()
                          : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        )}

        {/* No Results */}
        {!isLoading && transactions.length === 0 && walletAddress && (
          <div className="text-center mt-8 text-gray-400 flex flex-col items-center">
            <AlertCircle className="w-10 h-10 mb-2 text-gray-500" />
            No transactions found for this address.
          </div>
        )}
      </motion.div>
    </>
  );
};

export default TransactionGuard;
