export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    console.log("Request body:", req.body);

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

    const text = await response.text(); // read raw text first
    console.log("Supabase response status:", response.status, text);

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      data = { raw: text }; // if JSON parse fails
    }

    res.status(200).json(data);
  } catch (err) {
    console.error("Error in API route:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
}
