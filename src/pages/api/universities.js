import { env } from '@/lib/constants/env';

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const page = req.query.page || 0;
    const size = req.query.size || 10000;
    const countryCode = req.query.countryCode || "";

    const base = (env.UNIVERSITY_API_URL || '').replace(/\/$/, '');
    let apiUrl = `${base}/api/universities/public?page=${page}&size=${size}`;
    if (countryCode) {
      apiUrl += `&country=${countryCode}`;
    }
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();

    // CORS Allow
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json(data);
  } catch (error) {
    console.error("API Proxy Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
