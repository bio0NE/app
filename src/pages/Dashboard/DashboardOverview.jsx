import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Zap, ShieldCheck, BarChart, Bell, Wallet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const HELIUS_API_KEY = "bc8f7363-9ae0-4da2-b3b7-789fd03da128"; // 🔥 Replace this

const StatCard = ({ icon, title, value, color, unit }) => {
  const Icon = icon;
  return (
    <Card className="glassmorphism border-t-2" style={{ borderTopColor: color }}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-300">{title}</CardTitle>
        <Icon className="h-5 w-5" style={{ color }} />
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold text-white">
          {value ?? '...'}
          {unit && <span className="text-xl text-gray-400 ml-1">{unit}</span>}
        </div>
      </CardContent>
    </Card>
  );
};

const DashboardOverview = () => {
  const { connected, publicKey } = useWallet();
  const [walletData, setWalletData] = useState({
    solBalance: null,
    tokens: [],
    creationDate: null,
    lastTx: null,
  });
  const [loading, setLoading] = useState(false);

  const fetchWalletData = async (address) => {
    try {
      setLoading(true);

      // --- Get SOL balance ---
// --- Get SOL balance ---
const balanceRes = await fetch(
  `https://api.helius.xyz/v0/addresses/${address}/balances?api-key=${HELIUS_API_KEY}`
);
      const balanceData = await balanceRes.json();
      const solBalance = balanceData.nativeBalance / 1e9; // Convert lamports → SOL

      // --- Get token assets ---
      const tokens = balanceData.tokens
        ? balanceData.tokens.map((t) => ({
            mint: t.mint,
            amount: t.amount / Math.pow(10, t.decimals),
            symbol: t.symbol ?? 'Unknown',
          }))
        : [];

      // --- Get transactions (for age + last TX) ---
      const txRes = await fetch(
        `https://api.helius.xyz/v0/addresses/${address}/transactions?api-key=${HELIUS_API_KEY}&limit=20`
      );
      const txData = await txRes.json();

      const lastTx = txData?.[0]?.timestamp
        ? new Date(txData[0].timestamp * 1000).toLocaleString()
        : "No transactions";

      const firstTx = txData?.[txData.length - 1]?.timestamp
        ? new Date(txData[txData.length - 1].timestamp * 1000)
        : null;

      const ageDays = firstTx
        ? Math.floor((Date.now() - firstTx.getTime()) / (1000 * 60 * 60 * 24))
        : "Unknown";

      setWalletData({
        solBalance,
        tokens,
        creationDate: ageDays,
        lastTx,
      });
    } catch (err) {
      console.error("Error fetching wallet data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (connected && publicKey) {
      fetchWalletData(publicKey.toBase58());
    }
  }, [connected, publicKey]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <>
      <Helmet>
        <title>Dashboard Overview | Solid Security</title>
      </Helmet>
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        <motion.div
          variants={itemVariants}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
            <p className="text-gray-400 mt-1">
              {connected
                ? "Here’s your wallet summary fetched live from Solana."
                : "Welcome back! Connect your wallet to see your data."}
            </p>
          </div>
          {!connected && (
            <div className="mt-4 md:mt-0">
              <WalletMultiButton
                style={{
                  backgroundColor: "#9945FF",
                  color: "white",
                  borderRadius: "0.5rem",
                  boxShadow: "0 0 15px rgba(153, 69, 255, 0.4)",
                }}
              />
            </div>
          )}
        </motion.div>

        {connected ? (
          loading ? (
            <motion.div variants={itemVariants} className="text-center text-gray-400 p-8">
              Fetching live wallet data...
            </motion.div>
          ) : (
            <motion.div
              variants={itemVariants}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
            >
              <StatCard
                icon={Wallet}
                title="SOL Balance"
                value={walletData.solBalance?.toFixed(3)}
                unit="SOL"
                color="#14F195"
              />
              <StatCard
                icon={ShieldCheck}
                title="Wallet Age"
                value={walletData.creationDate}
                unit="days"
                color="#38bdf8"
              />
              <StatCard
                icon={BarChart}
                title="Assets"
                value={walletData.tokens.length}
                color="#9945FF"
              />
              <StatCard
                icon={Bell}
                title="Last Transaction"
                value={walletData.lastTx}
                color="#f59e0b"
              />
            </motion.div>
          )
        ) : (
          <motion.div variants={itemVariants} className="text-center p-12 glassmorphism rounded-xl">
            <h2 className="text-2xl font-semibold mb-4">Connect Your Wallet</h2>
            <p className="text-gray-400 mb-6">
              Connect your wallet to scan for threats and view your security dashboard.
            </p>
            <WalletMultiButton
              style={{
                backgroundColor: "#9945FF",
                color: "white",
                borderRadius: "0.5rem",
                boxShadow: "0 0 15px rgba(153, 69, 255, 0.4)",
              }}
            />
          </motion.div>
        )}
      </motion.div>
    </>
  );
};

export default DashboardOverview;
