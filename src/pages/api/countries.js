import { env } from '@/lib/constants/env';

export default async function handler(req, res) {
    try {
        if (req.method !== "GET") {
            return res.status(405).json({ error: "Method Not Allowed" });
        }

        const base = (env.UNIVERSITY_API_URL || '').replace(/\/$/, '');
        const response = await fetch(
            `${base}/api/universities/countries`
        );

        if (!response.ok) {
            throw new Error("Failed to fetch external API");
        }

        const data = await response.json();

        // Optional: Add CORS headers
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");

        res.status(200).json(data);
    } catch (error) {
        console.error("API Route Error:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
}
