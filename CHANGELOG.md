# Changelog

## [1.0.0] - 2026-01-14

### 🚀 Launch of SOLSEC V1
We are proud to announce the official release of SOLSEC v1.0.0, a comprehensive Solana security dashboard powered by AI.

### ✨ Key Features
- **Contract Verifier**: Analyze any Solana token contract for red flags.
  - Integration with Helius & Moralis APIs.
  - AI-Powered Security Score (0-100).
- **Wallet Scanner**: Deep dive into wallet activities.
  - View SOL balance and token holdings.
  - Risk assessment based on balance and activity.
- **Rug Checker**: Specialized tool for checking new tokens.
  - Analyzes Liquidity, Volume, and Bonding Curves.
  - "Trust Score" to identify potential rug pulls.
- **Dashboard UI**:
  - Modern, Glassmorphism design system.
  - "Solana Glow" aesthetic with dark mode optimization.
  - Responsive layout with Framer Motion animations.

### 🛠️ Architecture & Security Improvements
- **Local Backend API**: 
  - Refactored `server.js` to serve as a robust middleware between Frontend and Blockchain APIs.
  - Implemented `/scanWallet`, `/getTokenData`, and `/analyzeTokenAI` endpoints locally.
- **Security**: 
  - **API Key Protection**: All sensitive keys (Helius, Moralis, Supabase) are now secured in `.env` and not exposed in client-side code.
- **Stability**:
  - Fixed numeric precision errors causing app crashes on balance display.
  - Unified data structures between Backend/Frontend to prevent "undefined" errors.
  - Corrected component duplication issues (RugChecker is now distinct from WalletScanner).

### 🐛 Bug Fixes
- Fixed `TypeError: toFixed is not a function` by ensuring backend returns raw numbers.
- Fixed Supabase Cloud Function calls failing by redirecting traffic to the local Express server.
- Removed unused legacy Next.js configuration files.

---
*Verified by Antigravity*
