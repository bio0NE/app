// src/api/openai/phishing-summary.js
export async function POST(req, res) {
  try {
    const body = await req.json();
    const { details } = body;

    // Here you'd normally call OpenAI API for analysis
    // For now, simulate a friendly AI explanation
    const summary = `This domain (${details.domain}) is hosted by ${details.isp}. 
    It's ${details.domainAgeDays} days old and registered under ${details.rdap?.registrar?.[0] || "unknown registrar"}.
    Based on the data, it appears ${details.dbThreatLevel ? "potentially risky" : "mostly safe"}.`;

    return new Response(JSON.stringify({ summary }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
