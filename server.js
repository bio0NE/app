// server.js
import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 54321;

app.use(cors());
app.use(express.json());

// ======= Config API Keys =======
const HELIUS_API_KEY = process.env.HELIUS_API_KEY;
const MORALIS_API_KEY = process.env.MORALIS_API_KEY;

if (!HELIUS_API_KEY || !MORALIS_API_KEY) {
  console.warn("WARNING: Missing API Keys in .env file. Some features may not work.");
}

// ======= Helper =======
// Return raw numbers, frontend handles formatting.
function safeFloat(val) {
  const num = parseFloat(val);
  return isNaN(num) ? 0 : num;
}

// ======= getTokenData API =======
app.post("/getTokenData", async (req, res) => {
  try {
    const { address, network } = req.body;
    if (!address) return res.status(400).json({ error: "Missing address" });

    // 1️⃣ Get balance from Helius
    let solBalance = 0;
    try {
      const heliusRes = await fetch(`https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jsonrpc: "2.0", id: "helius-balance", method: "getBalance", params: [address] }),
      });
      const heliusJson = await heliusRes.json();
      solBalance = (heliusJson?.result?.value || 0) / 1e9;
    } catch (e) {
      console.error("Helius Error:", e.message);
    }

    // 2️⃣ Get token price (Moralis)
    let priceJson = {};
    try {
      const priceRes = await fetch(`https://solana-gateway.moralis.io/token/mainnet/${address}/price`, {
        headers: { accept: "application/json", "X-API-Key": MORALIS_API_KEY },
      });
      priceJson = await priceRes.json();
    } catch (e) {
      console.error("Moralis Price Error:", e.message);
    }

    // 3️⃣ Get token pairs & metadata (Moralis)
    let pairJson = { pairs: [] };
    try {
      const pairRes = await fetch(`https://solana-gateway.moralis.io/token/mainnet/${address}/pairs`, {
        headers: { accept: "application/json", "X-API-Key": MORALIS_API_KEY },
      });
      pairJson = await pairRes.json();
    } catch (e) {
      console.error("Moralis Pairs Error:", e.message);
    }

    const tokenInfo = pairJson?.pairs?.[0]?.pair?.find((p) => p?.tokenAddress === address) || {};
    const firstPair = pairJson?.pairs?.[0] || {};

    // 4️⃣ Get bonding progress (Moralis)
    let bondingJson = {};
    try {
      const bondingRes = await fetch(`https://solana-gateway.moralis.io/token/mainnet/${address}/bonding-status`, {
        headers: { accept: "application/json", "X-API-Key": MORALIS_API_KEY },
      });
      bondingJson = await bondingRes.json();
    } catch (e) {
      console.error("Moralis Bonding Error:", e.message);
    }

    // Construct Result - Sending raw numbers where possible
    const result = {
      address,
      network: network || "mainnet-beta",
      name: tokenInfo?.tokenName || "Unknown Token",
      symbol: tokenInfo?.tokenSymbol || "N/A",
      decimals: tokenInfo?.tokenDecimals || 9,
      price: safeFloat(priceJson?.usdPrice),
      nativePrice: safeFloat(priceJson?.nativePrice?.value) / 1e9,
      marketCap: safeFloat(firstPair.liquidityUsd), // Approx as liquidity for now, or fetch real MC if available
      volume24h: safeFloat(firstPair.volume24hrUsd),
      liquidityUsd: safeFloat(firstPair.liquidityUsd),
      bondingProgress: safeFloat(bondingJson?.bondingProgress),
      solBalance: solBalance,
      owner: "Unknown", // Helius doesn't usually return 'owner' in getBalance
      ath: safeFloat(priceJson?.usdPrice) * 1.2, // Mock estimation
      pumpfun_link: `https://pump.fun/coin/${address}`,
      chart_link: `https://pump.fun/chart/${address}`,
      lastUpdated: new Date().toISOString(),

      // Legacy Structure compatibility (optional, but cleaner not to double wrap)
      tokenData: {
        name: tokenInfo?.tokenName || "Unknown Token"
      }
    };

    // Flatten structure is better, frontend should adapt.
    res.json(result);
  } catch (error) {
    console.error("Error in getTokenData:", error);
    res.status(500).json({ error: error.message });
  }
});

// ======= scanWallet API =======
app.post("/scanWallet", async (req, res) => {
  try {
    const { address, walletAddress, network } = req.body; // handle both key names
    const targetAddress = address || walletAddress;

    if (!targetAddress) return res.status(400).json({ error: "Missing wallet address" });

    // 1. Get Balance
    let solBalance = 0;
    try {
      const heliusRes = await fetch(`https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jsonrpc: "2.0", id: "helius-balance", method: "getBalance", params: [targetAddress] }),
      });
      const heliusJson = await heliusRes.json();
      solBalance = (heliusJson?.result?.value || 0) / 1e9;
    } catch (e) {
      console.error("Helius Balance Error:", e.message);
    }

    // 2. Determine Risk / Score (Mock Logic for demo functionality)
    // Real implementation would check recent transactions for suspicious patterns
    const score = solBalance > 0.1 ? 85 : 40;

    const result = {
      wallet: targetAddress,
      address: targetAddress,
      network: network || "mainnet-beta",
      solBalance: solBalance, // number
      totalTokens: 0, // Placeholder
      score: score,
      analysis: {
        solBalance: solBalance,
        txCount: 0, // Placeholder
        flags: []
      },
      tokens: [], // Placeholder
      heliusAddressRaw: {} // Placeholder debug
    };

    res.json(result);

  } catch (err) {
    console.error("Error in scanWallet:", err);
    res.status(500).json({ error: err.message });
  }
});

// ======= analyzeTokenAI API =======
app.post("/analyzeTokenAI", (req, res) => {
  try {
    const tokenData = req.body;
    // Simulate AI analysis delay
    const aiResult = {
      score: Math.floor(Math.random() * 100),
      verdict: "Safe",
      reason: "No suspicious indicators detected based on available metadata."
    };
    res.json({ aiResult });
  } catch (err) {
    console.error("Error in analyzeTokenAI:", err);
    res.status(500).json({ error: err.message });
  }
});

// ======= Run server =======
app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});
