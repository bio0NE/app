import React, { useRef } from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, Menu } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { useState } from "react";


const LandingPage = () => {
  const { toast } = useToast();
  const contractAddress = "SoLiDxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

  // Copy contract to clipboard + toast
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(contractAddress);
      toast({
        title: "Contract copied",
        description: contractAddress,
      });
    } catch (e) {
      toast({
        title: "Copy failed",
        description: "Please copy manually.",
      });
    }
  };

const dashboardImages = [
  "/ss1.png",
  "/ss2.png",
  "/ss3.png",
  "/ss4.png",
];


const [[index, direction], setIndex] = useState([0, 0]);

const paginate = (dir) => {
  setIndex(([prev]) => {
    const next = (prev + dir + dashboardImages.length) % dashboardImages.length;
    return [next, dir];
  });
};
  // Open Solscan
  const viewOnSolscan = () => {
    window.open(`https://solscan.io/token/${contractAddress}`, "_blank");
  };

  // Smooth scroll helper
  const aboutRef = useRef(null);
  const featuresRef = useRef(null);
  const tokenRef = useRef(null);
  const dashboardRef = useRef(null);
  const contactRef = useRef(null);

  const scrollTo = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Motion variants
  const container = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };
  const fadeUp = {
    hidden: { y: 28, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 110 } },
  };

  const floatSlow = {
  hidden: { y: 0 },
  visible: {
    y: [0, -12, 0],
    transition: { duration: 6, repeat: Infinity, ease: "easeInOut" },
  },
};

const glowPulse = {
  hidden: { opacity: 0.6 },
  visible: {
    opacity: [0.6, 1, 0.6],
    transition: { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
  },
};

const hoverLift = {
  whileHover: { y: -8, scale: 1.02 },
  transition: { type: "spring", stiffness: 300 },
};

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 120 : -120,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    x: direction > 0 ? -120 : 120,
    opacity: 0,
  }),
};



  return (
    <>
      <Helmet>
        <title>Solid Security — Where Solana meets uncompromising security</title>
        <meta
          name="description"
          content="Solid Security is a next-generation protection suite for Solana — on-chain scanners, AI threat detection, wallet protection, and a tokenized governance system."
        />
      </Helmet>

      {/* Page container */}
      <div className="min-h-screen bg-[#02010A] text-white overflow-x-hidden">

        {/* Backdrop glows */}
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute -top-40 -left-40 w-[550px] h-[550px] rounded-full blur-[200px] bg-[#7C3AED]/30 animate-tilt" />
          <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full blur-[200px] bg-[#14F195]/20 animate-tilt delay-1000" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/70" />
        </div>

        {/* NAVBAR */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-lg border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <motion.img
                src="/icon.png"
                alt="Solid Security"
                className="h-10 w-10 drop-shadow"
                whileHover={{ rotate: 6, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
              <div>
                <div className="text-lg font-bold tracking-tight">Solid Security</div>
                <div className="text-xs text-gray-400 -mt-0.5">On-chain security for Solana</div>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-8 text-sm text-gray-200">
              <button onClick={() => scrollTo(aboutRef)} className="hover:text-[#14F195]">About</button>
              <button onClick={() => scrollTo(featuresRef)} className="hover:text-[#14F195]">Features</button>
              <button onClick={() => scrollTo(tokenRef)} className="hover:text-[#14F195]">Token</button>
              <button onClick={() => scrollTo(dashboardRef)} className="hover:text-[#14F195]">Dashboard</button>
              <button onClick={() => scrollTo(contactRef)} className="hover:text-[#14F195]">Contact</button>
            </nav>

            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button className="hidden md:inline-flex bg-[#7C3AED] hover:bg-[#6D28D9] rounded-xl px-4 py-2 text-sm font-semibold">
                  Launch App
                </Button>
              </Link>
              <button className="md:hidden p-2 rounded-lg border border-white/6 bg-black/20">
                <Menu className="h-5 w-5 text-gray-300" />
              </button>
            </div>
          </div>
        </header>

        {/* HERO */}
        <main className="pt-28">
          <section className="min-h-[78vh] flex items-center justify-center text-center px-6">
            <motion.div
              variants={container}
              initial="hidden"
              animate="visible"
              className="max-w-4xl mx-auto"
            >
              <motion.img
                variants={fadeUp}
                src="/icon.png"
                alt="Solid Security icon"
                className="mx-auto h-40 w-40 mb-6 drop-shadow-2xl"
              />

              <motion.h1
                variants={fadeUp}
                className="pb-2 text-4xl md:text-6xl font-extrabold tracking-tight leading-normal bg-clip-text text-transparent bg-gradient-to-br from-white via-gray-300 to-gray-500"
              >
                Where Solana meets uncompromising security
              </motion.h1>

              <motion.p variants={fadeUp} className="mt-6 text-lg text-gray-300 max-w-3xl mx-auto">
                Solid Security is a next-generation protection suite engineered for the Solana
                ecosystem—real-time threat intelligence, automated contract scrutiny, and wallet
                defenses that run at block speed. Protect your assets and your community with
                enterprise-grade tooling, designed for builders and investors alike.
              </motion.p>

              <motion.div variants={fadeUp} className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link to="/dashboard">
                  <Button className="px-8 py-4 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-lg font-semibold shadow-md">
                    Launch Dashboard
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  className="px-8 py-4 rounded-2xl border-[#14F195]/30 text-[#14F195] hover:bg-[#14F195]/8"
                  onClick={() => scrollTo(aboutRef)}
                >
                  Learn More
                </Button>
              </motion.div>

              {/* Contract Box */}
              <motion.div variants={fadeUp} className="mt-10 max-w-xl mx-auto px-6">
                <div className="rounded-3xl p-5 bg-gradient-to-br from-white/3 via-white/2 to-transparent border border-white/8 backdrop-blur-md shadow-lg">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider">Contract</div>
                      <div className="mt-1 font-mono text-sm text-[#14F195] truncate">{contractAddress}</div>
                      <div className="text-xs text-gray-500 mt-1">Solana token contract — verified badge coming</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={copyToClipboard} className="rounded-lg hover:bg-white/6">
                        <Copy className="h-5 w-5 text-gray-300" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={viewOnSolscan} className="rounded-lg hover:bg-white/6">
                        <ExternalLink className="h-5 w-5 text-gray-300" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="mt-6 text-xs text-gray-400 tracking-wider">
                <span className="text-[#14F195] font-semibold">Powered by Solana</span> — fast, secure, and transparent.
              </motion.div>
            </motion.div>
          </section>

          {/* ABOUT */}
          <section ref={aboutRef} className="py-24 px-6 md:px-12">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="max-w-5xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold">Built for the future of Web3 protection</h2>
              <p className="mt-4 text-gray-300 max-w-3xl mx-auto">
                The crypto landscape moves at light speed — and so do threats. Solid Security was
                crafted by auditors, developers, and threat analysts who have seen how exploits
                unfold. Our mission is to stop attacks before funds move. We combine on-chain
                telemetry, signature-based detection, and machine learning to give you a real,
                actionable security edge.
              </p>

              <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-white/4 border border-white/8 backdrop-blur
                  shadow-[0_20px_60px_rgba(0,0,0,0.35)]
                  hover:border-[#14F195]/40 hover:shadow-[0_30px_80px_rgba(20,241,149,0.15)]
                  transition-all duration-300">
                  <h3 className="text-lg font-semibold text-[#14F195]">Smart Contract Guardian</h3>
                  <p className="mt-2 text-gray-300 text-sm">
                    Automated contract scans for honeypots, unsafe admin controls, and suspicious mint logic.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-white/4 border border-white/8 backdrop-blur
                  shadow-[0_20px_60px_rgba(0,0,0,0.35)]
                  hover:border-[#14F195]/40 hover:shadow-[0_30px_80px_rgba(20,241,149,0.15)]
                  transition-all duration-300">
                  <h3 className="text-lg font-semibold text-[#14F195]">Wallet Shield</h3>
                  <p className="mt-2 text-gray-300 text-sm">
                    Real-time protection for wallet connections — detect drainer scripts, hidden approvals, and airdrop scams.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-white/4 border border-white/8 backdrop-blur
                  shadow-[0_20px_60px_rgba(0,0,0,0.35)]
                  hover:border-[#14F195]/40 hover:shadow-[0_30px_80px_rgba(20,241,149,0.15)]
                  transition-all duration-300">
                  <h3 className="text-lg font-semibold text-[#14F195]">Incident Monitor</h3>
                  <p className="mt-2 text-gray-300 text-sm">
                    Live alerts when tokens you follow show risky behavior, sudden liquidity changes, or suspicious upgrades.
                  </p>
                </div>
              </div>
            </motion.div>
          </section>

          {/* FEATURES */}
          <section ref={featuresRef} className="py-24 px-6 md:px-12 bg-gradient-to-b from-transparent to-black/60">
            <div className="max-w-7xl mx-auto">
              <motion.h2 initial="hidden" whileInView="visible" variants={fadeUp} className="text-3xl md:text-4xl font-bold text-center">
                Core features you can rely on
              </motion.h2>

              <motion.div initial="hidden" whileInView="visible" variants={container} className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    title: "Wallet Safety Scanner",
                    desc: "Deep analysis of transaction history, contract interactions, and approvals — yields a concise Security Index and remediation steps.",
                  },
                  {
                    title: "Token Contract Verifier",
                    desc: "Verify source, liquidity locks, and authority control. Get a clear risk breakdown for new tokens.",
                  },
                  {
                    title: "Rug Checker",
                    desc: "AI-driven heuristics detect improbable behavior, LP manipulation, and ownership concentration to surface rug risk early.",
                  },
                  {
                    title: "Phishing Link Detector",
                    desc: "Scan any dApp URL or link before connecting your wallet. Flagged links show official alternatives.",
                  },
                  {
                    title: "Transaction Guard",
                    desc: "Simulate transactions and reveal hidden calls. Know what will execute before you sign.",
                  },
                  {
                    title: "Watchlist & Alerts",
                    desc: "Follow contracts and wallets. Receive instant notifications to Telegram, email, or in-app when risk changes.",
                  },
                ].map((f, i) => (
                  <motion.div key={i} variants={fadeUp} className="p-6 rounded-2xl bg-white/4 border border-white/8 backdrop-blur
                  shadow-[0_20px_60px_rgba(0,0,0,0.35)]
                  hover:border-[#7C3AED]/40 hover:shadow-[0_30px_80px_rgba(20,241,149,0.15)]
                  transition-all duration-300"
>
                    <h3 className="text-lg font-semibold text-[#7C3AED]">{f.title}</h3>
                    <p className="mt-2 text-gray-300 text-sm">{f.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* TOKEN UTILITY */}
          <section ref={tokenRef} className="py-24 px-6 md:px-12">
            <motion.div initial="hidden" whileInView="visible" variants={fadeUp} className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold">$SOLID — token utility & governance</h2>
              <p className="mt-4 text-gray-300">$SOLID powers priority scans, staking rewards, DAO voting, and access to advanced AI features. Holders improve the network’s resilience and gain early access to premium tools.</p>

              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <div className="px-6 py-4 rounded-xl border border-white/8 bg-white/3 text-sm text-[#14F195]">Priority Scans</div>
                <div className="px-6 py-4 rounded-xl border border-white/8 bg-white/3 text-sm text-[#14F195]">Staking & Rewards</div>
                <div className="px-6 py-4 rounded-xl border border-white/8 bg-white/3 text-sm text-[#14F195]">DAO Governance</div>
                <div className="px-6 py-4 rounded-xl border border-white/8 bg-white/3 text-sm text-[#14F195]">Holder Insights</div>
              </div>

              <div className="mt-8 flex justify-center gap-4">
                <Button className="bg-[#7C3AED] px-6 py-3 rounded-lg">Tokenomics</Button>
                <Button variant="outline" className="border-[#14F195]/30 text-[#14F195] px-6 py-3 rounded-lg">Audit Reports</Button>
              </div>
            </motion.div>
          </section>

{/* DASHBOARD PREVIEW */}
<section
  ref={dashboardRef}
  className="py-24 px-6 md:px-12 bg-gradient-to-b from-black/0 to-black/70"
>
  <motion.div
    initial="hidden"
    whileInView="visible"
    variants={fadeUp}
    className="max-w-6xl mx-auto text-center"
  >
    <h2 className="text-3xl md:text-4xl font-bold">
      Your Security Hub — Real tools, real protection
    </h2>
    <p className="mt-4 text-gray-300 max-w-3xl mx-auto">
      All core utilities live inside a single dashboard — fast scans, risk indexes,
      watchlists, and incident reporting. Built for operators, auditors, and everyday users.
    </p>

    {/* CAROUSEL */}
    <div className="relative mt-12 overflow-hidden">
      {/* Glow */}
      <div className="absolute inset-0 blur-3xl bg-[#7C3AED]/20 rounded-3xl" />

      <motion.img
        key={index}
        src={dashboardImages[index]}
        custom={direction}
        variants={slideVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.45, ease: "easeOut" }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.9}
        onDragEnd={(_, { offset, velocity }) => {
          if (offset.x > 80) paginate(-1);
          else if (offset.x < -80) paginate(1);
        }}
        className="relative mx-auto w-full max-w-5xl rounded-3xl
        border border-white/10
        shadow-[0_40px_120px_rgba(124,58,237,0.25)]
        cursor-grab active:cursor-grabbing"
        alt="Dashboard preview"
      />

      {/* Controls */}
      <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-6 pointer-events-none">
        <button
          onClick={() => paginate(-1)}
          className="pointer-events-auto h-12 w-12 rounded-full bg-black/40 backdrop-blur
          border border-white/10 hover:border-[#14F195]/40 transition"
        >
          ‹
        </button>
        <button
          onClick={() => paginate(1)}
          className="pointer-events-auto h-12 w-12 rounded-full bg-black/40 backdrop-blur
          border border-white/10 hover:border-[#14F195]/40 transition"
        >
          ›
        </button>
      </div>
    </div>

    {/* Indicators */}
    <div className="mt-6 flex justify-center gap-2">
      {dashboardImages.map((_, i) => (
        <button
          key={i}
          onClick={() => setIndex([i, i > index ? 1 : -1])}
          className={`h-2 w-2 rounded-full transition-all
            ${i === index ? "bg-[#14F195] w-6" : "bg-white/20"}`}
        />
      ))}
    </div>

    <div className="mt-10">
      <Link to="/dashboard">
        <Button className="bg-[#14F195] text-black px-8 py-4 rounded-2xl font-semibold hover:scale-[1.02] transition">
          Open Dashboard
        </Button>
      </Link>
    </div>
  </motion.div>
</section>


          {/* CALL-TO-ACTION */}
          <section ref={contactRef} className="py-20 px-6 md:px-12">
            <motion.div initial="hidden" whileInView="visible" variants={fadeUp} className="max-w-4xl mx-auto text-center bg-white/3 border border-white/6 rounded-3xl p-10 backdrop-blur">
              <h3 className="text-2xl md:text-3xl font-bold">Join the mission to secure Solana</h3>
              <p className="mt-3 text-gray-300">Solid Security is more than a tool — it's a community-driven defense network. Join early, help shape the DAO, and get priority protections.</p>

              <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/dashboard">
                  <Button className="bg-[#7C3AED] px-6 py-3 rounded-2xl">Launch Dashboard</Button>
                </Link>
                <a href="https://t.me/SolidSecurity" target="_blank" rel="noreferrer">
                  <Button variant="outline" className="border-[#14F195]/30 text-[#14F195] px-6 py-3 rounded-2xl">Visit Our Social</Button>
                </a>
              </div>
            </motion.div>
          </section>

          {/* FOOTER */}
          <footer className="py-10 px-6 md:px-12 border-t border-white/8 text-gray-400">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm">
                <div className="font-semibold">Solid Security</div>
                <div className="text-xs mt-1">© 2025 — Securing the Solana Ecosystem</div>
              </div>

<div className="flex items-center gap-6 text-sm">
  <a
    href="https://docs.solsec.xyz/"
    target="_blank"
    rel="noopener noreferrer"
    className="hover:text-[#14F195]"
  >
    Docs
  </a>

  <a
    href="https://audit.solidsecurity.xyz"
    target="_blank"
    rel="noopener noreferrer"
    className="hover:text-[#14F195]"
  >
    Audit
  </a>

  <a
    href="https://x.com/SOLSEC_OFC"
    target="_blank"
    rel="noopener noreferrer"
    className="hover:text-[#14F195]"
  >
    Twitter / X
  </a>

  <a
    href="https://github.com/Solsec-SolidSecurity"
    target="_blank"
    rel="noopener noreferrer"
    className="hover:text-[#14F195]"
  >
    GitHub
  </a>
</div>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
};

export default LandingPage;
