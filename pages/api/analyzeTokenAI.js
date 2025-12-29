// pages/api/getTokenData.js
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    console.log("API route body:", req.body);

    const response = await fetch(
      "https://crcxgwhorwiytksalpbj.supabase.co/functions/v1/getTokenData",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.SUPABASE_KEY,
          Authorization: `Bearer ${process.env.SUPABASE_KEY}`,
        },
        body: JSON.stringify(req.body),
      }
    );

    const text = await response.text(); // raw text
    console.log("Supabase response status:", response.status, text);

    let data;
    try {
      data = JSON.parse(text); // parse JSON
    } catch (e) {
      console.error("Failed to parse JSON:", e);
      return res.status(500).json({ error: "Invalid JSON from Supabase", raw: text });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error("Error in API route:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
}
