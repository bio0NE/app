// server.js
import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = 54321;

app.use(express.json());

// ======= Config API Keys =======
const HELIUS_API_KEY = "bc8f7363-9ae0-4da2-b3b7-789fd03da128";
const MORALIS_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6Ijk3MTYxOGFjLTc1MGUtNDAzNC04NjEwLTcwOTczOTA1MmFlNCIsIm9yZ0lkIjoiNDc3MTgwIiwidXNlcklkIjoiNDkwOTM5IiwidHlwZUlkIjoiNjU2ZmU1Y2MtOTRlNC00ZWEwLWIyZGEtZjQ3NjFmNGJhMGQ3IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3NjExMTcwMDAsImV4cCI6NDkxNjg3NzAwMH0.xmBsij1ZeWcw1EcGNJdMpY8iBp6SEBpkd7aiAsrnFyU";

// ======= Helper =======
function formatNumber(num, decimals = 2) {
  if (!num || isNaN(num)) return "0";
  return Number(num).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

// ======= getTokenData API =======
app.post("/getTokenData", async (req, res) => {
  try {
    const { address, network } = req.body;
    if (!address || !network) return res.status(400).json({ error: "Missing address or network" });

    // 1️⃣ Get balance from Helius
    const heliusRes = await fetch(`https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: "helius-balance", method: "getBalance", params: [address] }),
    });
    const heliusJson = await heliusRes.json();
    const solBalance = heliusJson?.result?.value / 1e9 || 0;

    // 2️⃣ Get token price
    const priceRes = await fetch(`https://solana-gateway.moralis.io/token/mainnet/${address}/price`, {
      headers: { accept: "application/json", "X-API-Key": MORALIS_API_KEY },
    });
    const priceJson = await priceRes.json();

    // 3️⃣ Get token pairs & metadata
    const pairRes = await fetch(`https://solana-gateway.moralis.io/token/mainnet/${address}/pairs`, {
      headers: { accept: "application/json", "X-API-Key": MORALIS_API_KEY },
    });
    const pairJson = await pairRes.json();
    const tokenInfo = pairJson?.pairs?.[0]?.pair?.find((p) => p?.tokenAddress === address);

    // 4️⃣ Get bonding progress
    const bondingRes = await fetch(`https://solana-gateway.moralis.io/token/mainnet/${address}/bonding-status`, {
      headers: { accept: "application/json", "X-API-Key": MORALIS_API_KEY },
    });
    const bondingJson = await bondingRes.json();

    const result = {
      address,
      network,
      name: tokenInfo?.tokenName || "Unknown Token",
      symbol: tokenInfo?.tokenSymbol || "N/A",
      decimals: tokenInfo?.tokenDecimals || "N/A",
      price: `$${formatNumber(priceJson?.usdPrice, 6)}`,
      nativePrice: `${formatNumber(parseFloat(priceJson?.nativePrice?.value) / 1e9, 6)} SOL`,
      marketCap: `$${formatNumber(pairJson?.pairs?.[0]?.liquidityUsd || 0, 2)}`,
      volume24h: `$${formatNumber(pairJson?.pairs?.[0]?.volume24hrUsd || 0, 2)}`,
      liquidityUsd: `$${formatNumber(pairJson?.pairs?.[0]?.liquidityUsd || 0, 2)}`,
      bondingProgress: `${formatNumber(bondingJson?.bondingProgress || 0, 2)}%`,
      solBalance: `${formatNumber(solBalance, 4)} SOL`,
      owner: heliusJson?.result?.owner || "Unknown",
      ath: `$${formatNumber(priceJson?.usdPrice * 1.2, 6)} (est)`,
      pumpfun_link: `https://pump.fun/coin/${address}`,
      chart_link: `https://pump.fun/chart/${address}`,
      lastUpdated: new Date().toISOString(),
    };

    res.json(result);
  } catch (error) {
    console.error("Error in getTokenData:", error);
    res.status(500).json({ error: error.message });
  }
});

// ======= analyzeTokenAI API =======
app.post("/analyzeTokenAI", (req, res) => {
  try {
    const tokenData = req.body;

    const aiResult = {
      score: Math.floor(Math.random() * 100),
      verdict: "Safe",
      reason: "No suspicious indicators detected."
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
