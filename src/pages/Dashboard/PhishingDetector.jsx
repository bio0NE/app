import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import {
  Eye,
  Search,
  Loader2,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// your existing helper file
import { analyzeHostForUrl } from "@/lib/phishingApi";

export default function PhishingDetector() {
  const { toast } = useToast();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleScan = async (e) => {
    e?.preventDefault?.();

    if (!url.trim()) {
      toast({
        variant: "destructive",
        title: "Missing URL",
        description: "Please enter a valid URL to scan.",
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      let normalized = url.trim();
      if (!/^https?:\/\//i.test(normalized)) normalized = "http://" + normalized;
      const hostname = new URL(normalized).hostname.replace(/^www\./i, "");

      const analysis = await analyzeHostForUrl(hostname);

      // --- Risk Scoring ---
      let score = 0;
      const reasons = [];

      if (analysis.domainAgeDays != null) {
        if (analysis.domainAgeDays < 30) {
          score += 40;
          reasons.push(`New domain (${analysis.domainAgeDays} days old)`);
        } else if (analysis.domainAgeDays < 180) {
          score += 15;
          reasons.push(`Recently registered domain (${analysis.domainAgeDays} days)`);
        }
      }

      if (analysis.rdapPrivacy) {
        score += 15;
        reasons.push("Registrant details are redacted or private");
      }

      const cloudProviders = [
        "cloudflare",
        "digitalocean",
        "aws",
        "amazon",
        "google",
        "azure",
        "ovh",
        "linode",
      ];
      const ispLower = (analysis.isp || "").toLowerCase();
      if (cloudProviders.some((v) => ispLower.includes(v))) {
        score += 10;
        reasons.push(`Hosted on ${analysis.isp}`);
      }

      if (/xn--/.test(hostname) || /[^a-zA-Z0-9.-]/.test(hostname)) {
        score += 15;
        reasons.push("Domain contains unusual characters or punycode");
      }

      if ((hostname.match(/-/g) || []).length > 3) {
        score += 10;
        reasons.push("Domain contains many hyphens");
      }

      // Check database for known phishing
      let dbThreatLevel = null;
      const { data: dbEntry } = await supabase
        .from("phishing_domains")
        .select("*")
        .eq("domain", hostname)
        .maybeSingle();

      if (dbEntry) {
        dbThreatLevel = dbEntry.threat_level;
        if (dbThreatLevel === "high") {
          score = 90;
          reasons.push("Domain found in internal threat database (HIGH risk)");
        } else if (dbThreatLevel === "medium") {
          score = Math.max(score, 60);
          reasons.push("Domain found in database (MEDIUM risk)");
        }
      }

      if (score > 100) score = 100;

      const verdict =
        score >= 70 ? "dangerous" : score >= 35 ? "suspicious" : "safe";

      const out = {
        hostname,
        normalized,
        analysis,
        score,
        verdict,
        reasons,
        dbThreatLevel,
        scanned_at: new Date().toISOString(),
      };

      setResult(out);

      await supabase.from("phishing_scans").insert({
        domain: hostname,
        url: normalized,
        verdict,
        score,
        details: out,
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Scan Failed",
        description: err.message || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  const verdictUI = {
    safe: {
      color: "text-green-400",
      border: "border-green-500/40",
      icon: <ShieldCheck className="w-14 h-14 text-green-400" />,
      title: "✅ Safe Website",
      desc: "No major phishing indicators found. Still, always stay cautious.",
    },
    suspicious: {
      color: "text-yellow-400",
      border: "border-yellow-500/40",
      icon: <ShieldQuestion className="w-14 h-14 text-yellow-400" />,
      title: "⚠️ Suspicious Website",
      desc: "Some factors raise suspicion. Verify legitimacy before entering data.",
    },
    dangerous: {
      color: "text-red-400",
      border: "border-red-500/40",
      icon: <ShieldAlert className="w-14 h-14 text-red-400" />,
      title: "🚨 Dangerous Website",
      desc: "High risk detected! Avoid sharing wallet or sensitive info.",
    },
  };

    return (
    <>
      <Helmet>
        <title>Phishing Detector | SOLSEC</title>
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-950 text-white p-6 flex flex-col items-center"
      >
        <div className="w-full"> {/* Remove max-w-2xl */}
          <div className="flex items-center space-x-3 mb-8">
            <Eye className="w-10 h-10 text-purple-500" />
            <div>
              <h1 className="text-3xl font-bold text-white">Phishing Detector</h1>
              <p className="text-gray-400">
                Check URLs against domain data and threat indicators.
              </p>
            </div>
          </div>
          <Card className="bg-gray-900/60 border border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Scan a URL</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleScan}
                className="flex flex-col sm:flex-row gap-3"
              >
                <Input
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                />
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Scanning...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" /> Scan
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8"
            >
              <Card
                className={`bg-gray-900/70 border ${verdictUI[result.verdict].border}`}
              >
                <CardContent className="text-center py-6">
                  <div className="flex flex-col items-center">
                    {verdictUI[result.verdict].icon}
                    <h2
                      className={`text-2xl font-bold mt-3 ${verdictUI[result.verdict].color}`}
                    >
                      {verdictUI[result.verdict].title}
                    </h2>
                    <p className="text-gray-300 mt-1">
                      {verdictUI[result.verdict].desc}
                    </p>
                  </div>

                  <div className="mt-6 text-left bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-3">
                      🔍 Scan Details
                    </h3>
                    <p>
                      <span className="text-purple-400 font-semibold">Domain:</span>{" "}
                      {result.hostname}
                    </p>
                    <p>
                      <span className="text-purple-400 font-semibold">Registrar:</span>{" "}
                      {result.analysis.rdapSummary?.registrar?.[0] || "Unknown"}
                    </p>
                    <p>
                      <span className="text-purple-400 font-semibold">Domain Age:</span>{" "}
                      {result.analysis.domainAgeDays
                        ? `${result.analysis.domainAgeDays} days`
                        : "Unknown"}
                    </p>
                    <p>
                      <span className="text-purple-400 font-semibold">IP:</span>{" "}
                      {result.analysis.ip || "Unknown"}
                    </p>
                    <p>
                      <span className="text-purple-400 font-semibold">ISP:</span>{" "}
                      {result.analysis.isp || "Unknown"}
                    </p>
                    <p>
                      <span className="text-purple-400 font-semibold">Score:</span>{" "}
                      {result.score} / 100
                    </p>
                    {result.reasons?.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-400 font-semibold mb-1">
                          Reasons:
                        </p>
                        <ul className="list-disc list-inside text-gray-400 text-sm space-y-1">
                          {result.reasons.map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </motion.div>
    </>
  );
}
