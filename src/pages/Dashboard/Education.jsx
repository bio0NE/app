
    import React from 'react';
    import { Helmet } from 'react-helmet';
    import { motion } from 'framer-motion';
    import {
  BookOpen,
  ShieldQuestion,
  Wallet,
  Bot,
  Link,
  AlertTriangle,
  Lock,
  Coins,
} from 'lucide-react';

    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

    const educationTopics = [
  {
    icon: ShieldQuestion,
    title: "Wallet Drainers Explained",
    description:
      "Wallet drainers are malicious smart contracts that trick users into approving unlimited access to their assets. Once approved, attackers can drain funds without further interaction.",
  },
  {
    icon: Wallet,
    title: "Understanding Token Approvals",
    description:
      "Token approvals allow DApps to spend your tokens. Unlimited or forgotten approvals are a major security risk and should be revoked regularly.",
  },
  {
    icon: Bot,
    title: "How Phishing Scams Work",
    description:
      "Phishing scams imitate real projects through fake websites, DMs, or ads to steal private keys, seed phrases, or trick users into signing malicious transactions.",
  },
  {
    icon: Coins,
    title: "Airdrop & Fake Token Scams",
    description:
      "Unsolicited tokens can be traps. Interacting with them or visiting links in their metadata may trigger malicious contracts or phishing attacks.",
  },
  {
    icon: Link,
    title: "Fake Websites & Clone DApps",
    description:
      "Scammers clone popular DApps with nearly identical domains. Always bookmark official links and double-check URLs before connecting your wallet.",
  },
  {
    icon: Lock,
    title: "Liquidity & Rug Pull Risks",
    description:
      "If liquidity is low or unlocked, token creators can remove funds suddenly. Always verify liquidity size, lock status, and ownership.",
  },
  {
    icon: AlertTriangle,
    title: "Dangerous Transaction Requests",
    description:
      "Not all transactions are swaps. Some grant permissions, change authorities, or enable hidden instructions. Always read wallet prompts carefully.",
  },
  {
    icon: ShieldQuestion,
    title: "Why 'Unlimited Approval' Is Risky",
    description:
      "Unlimited approvals allow contracts to spend your tokens forever. If the contract is compromised later, your funds remain at risk.",
  },
  {
    icon: Wallet,
    title: "Cold Wallet vs Hot Wallet",
    description:
      "Hot wallets are convenient but vulnerable. Cold wallets store keys offline and significantly reduce the risk of hacks and drainers.",
  },
  {
    icon: Bot,
    title: "Malicious Browser Extensions",
    description:
      "Fake wallet or crypto extensions can log keystrokes and replace addresses. Install extensions only from verified sources.",
  },
  {
    icon: AlertTriangle,
    title: "Social Engineering Attacks",
    description:
      "Scammers exploit trust, urgency, or fear to manipulate users into making mistakes. Most hacks start with psychology, not code.",
  },
  {
    icon: Coins,
    title: "Fake Presales & Private Sales",
    description:
      "Scammers impersonate early-stage projects and collect funds for presales that never launch. Always verify official announcements.",
  },
  {
    icon: ShieldQuestion,
    title: "Impersonated Team Accounts",
    description:
      "Fake admins and founders often DM users pretending to offer help or deals. Legitimate teams will never DM you first.",
  },
  {
    icon: Link,
    title: "Google & Twitter Ad Scams",
    description:
      "Paid ads can promote fake DApps and phishing sites. Ads are not a trust signal — attackers often pay to appear legitimate.",
  },
  {
    icon: Lock,
    title: "Multisig ≠ Safety Guarantee",
    description:
      "Multisig wallets reduce risk but don’t eliminate it. If signers collude or keys are compromised, funds can still be drained.",
  },
  {
    icon: Wallet,
    title: "Seed Phrase Storage Mistakes",
    description:
      "Storing seed phrases digitally or sharing them exposes you to theft. Write them offline and never upload them anywhere.",
  },
  {
    icon: AlertTriangle,
    title: "Fake Security Tools",
    description:
      "Some websites pretend to be scanners or revokers but are actually drainers. Always verify tools before connecting wallets.",
  },
  {
    icon: Coins,
    title: "High APY = High Risk",
    description:
      "Extremely high yields often indicate Ponzi mechanics or unsustainable tokenomics. If it sounds too good to be true, it usually is.",
  },
  {
    icon: ShieldQuestion,
    title: "Token Authority Risks",
    description:
      "If mint or freeze authority is active, token creators may mint new tokens or freeze wallets. Always check authority status.",
  },
  {
    icon: Bot,
    title: "AI Voice & Deepfake Scams",
    description:
      "Scammers now use AI-generated voices and videos to impersonate founders. Never trust audio or video alone.",
  },
  {
    icon: Wallet,
    title: "Public Wallet ≠ Safe Wallet",
    description:
      "Having a public wallet address doesn’t protect you. Attackers analyze on-chain behavior to target high-value wallets.",
  },
  {
    icon: AlertTriangle,
    title: "Fake NFT Mints",
    description:
      "Fake mint pages imitate real NFT drops. Connecting your wallet may approve malicious contracts instead of minting NFTs.",
  },
  {
    icon: Link,
    title: "Discord & Telegram Compromises",
    description:
      "Even official communities can be hacked. A single compromised admin account can spread malicious links instantly.",
  },
  {
    icon: Lock,
    title: "Why Audits Are Not Enough",
    description:
      "Audits reduce risk but don’t prevent future changes, upgrades, or social attacks. Audited projects can still rug.",
  },
  {
    icon: Coins,
    title: "Low Liquidity Manipulation",
    description:
      "Low liquidity makes prices easy to manipulate. Small trades can cause massive price swings designed to trap users.",
  },
  {
    icon: ShieldQuestion,
    title: "Transaction Simulation Matters",
    description:
      "Simulating transactions helps reveal hidden token transfers or approvals before signing. Never blindly approve.",
  },
  {
    icon: Wallet,
    title: "Using Separate Wallets",
    description:
      "Use separate wallets for trading, minting, and long-term storage. This limits damage if one wallet is compromised.",
  },
  {
    icon: AlertTriangle,
    title: "Emergency Revocation",
    description:
      "If you suspect compromise, revoke approvals immediately and move funds to a fresh wallet.",
  },
  {
    icon: ShieldQuestion,
    title: "No Tool Can Guarantee Safety",
    description:
      "Security tools reduce risk but cannot eliminate it. Awareness, skepticism, and discipline are your strongest defenses.",
  },
];
    const Education = () => {
      return (
        <>
          <Helmet>
            <title>Education Center | Solid Security</title>
          </Helmet>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center space-x-4 mb-8">
                <BookOpen className="w-10 h-10 text-solana-teal" />
                <div>
                    <h1 className="text-3xl font-bold text-white">Security Education Center</h1>
                    <p className="text-gray-400">Stay ahead of scammers by learning about common threats.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {educationTopics.map((topic, index) => (
                    <motion.div
                        key={topic.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                        <Card className="h-full glassmorphism-light hover:border-solana-purple/50 transition-all duration-300">
                            <CardHeader className="flex flex-row items-center gap-4">
                                <topic.icon className="w-8 h-8 text-solana-purple" />
                                <CardTitle className="text-white text-lg">{topic.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-400">{topic.description}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
          </motion.div>
        </>
      );
    };

    export default Education;
  