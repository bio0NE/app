// src/lib/phishingApi.js
// NOTE: This file only uses public/free endpoints — no API keys required.
// - RDAP: https://rdap.org/domain/<domain>
// - ipwhois: https://ipwhois.app/json/<ip>  (free tier)
// If you want more robust data, swap or add API providers (some require keys).

/**
 * analyzeHostForUrl(hostname)
 * returns:
 * {
 *   hostname,
 *   rdap,            // full RDAP JSON if available
 *   rdapSummary,     // small summary (registrar, created, updated)
 *   rdapPrivacy,     // boolean if registrant redacted/privacy
 *   ip,              // resolved IP (string) or null
 *   isp,             // ISP / org (from ipwhois)
 *   domainAgeDays,   // integer days since creation if available
 * }
 */
export async function analyzeHostForUrl(hostname) {
  const out = { hostname, rdap: null, rdapSummary: null, rdapPrivacy: false, ip: null, isp: null, domainAgeDays: null };

  // 1) RDAP lookup (domain registration info)
  try {
    // rdap.org provides a convenient public RDAP gateway
    const rdapRes = await fetch(`https://rdap.org/domain/${hostname}`);
    if (rdapRes.ok) {
      const rdap = await rdapRes.json();
      out.rdap = rdap;

      // basic summary
      out.rdapSummary = {
        handle: rdap.handle,
        events: Array.isArray(rdap.events) ? rdap.events : undefined,
        registrar: rdap.entities?.map(e => e.vcardArray?.[1]?.find(v => v[0] === 'fn')?.[3]).filter(Boolean),
      };

      // try to compute domain age: look for event with eventAction 'registration'
      if (rdap.events) {
        const regEvent = rdap.events.find(ev => (ev.eventAction || '').toLowerCase().includes('registration') || (ev.eventAction || '').toLowerCase().includes('create'));
        if (regEvent && regEvent.eventDate) {
          const created = new Date(regEvent.eventDate);
          const days = Math.floor((Date.now() - created.getTime()) / (1000 * 60 * 60 * 24));
          out.domainAgeDays = days;
        }
      }

      // detect privacy redaction (rdap often includes "redacted for privacy" in remarks)
      const remarksText = JSON.stringify(rdap.remarks || []);
      if (/redacted|privacy|whoisguard|whois privacy|private registration/i.test(remarksText)) {
        out.rdapPrivacy = true;
      }
    }
  } catch (e) {
    // fail silently — rdap may not have entry
    // console.warn('RDAP failed', e);
  }

  // 2) Resolve IP (DNS)
  try {
    // we can use a public DNS-over-HTTPS resolver to get A records:
    // Google DoH: https://dns.google/resolve?name=example.com&type=A
    const doh = await fetch(`https://dns.google/resolve?name=${hostname}&type=A`);
    if (doh.ok) {
      const dohJson = await doh.json();
      if (dohJson?.Answer?.length) {
        // pick the first A record
        const a = dohJson.Answer.find(a => a.type === 1) || dohJson.Answer[0];
        if (a) out.ip = a.data;
      }
    }
  } catch (e) {
    // ignore
  }

  // 3) Lookup IP details (isp, org) using ipwhois.app (free)
  try {
    if (out.ip) {
      const ipInfo = await fetch(`https://ipwhois.app/json/${out.ip}`);
      if (ipInfo.ok) {
        const ipJson = await ipInfo.json();
        out.isp = ipJson.isp || ipJson.org || ipJson.connection?.isp || null;
      }
    }
  } catch (e) {
    // ignore
  }

  return out;
}
