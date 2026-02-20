import { env } from '@/lib/constants/env';

export default async function handler(req, res) {
        try {
        if (req.method !== "POST") {
            return res.status(405).json({ error: "Method Not Allowed" });
        }

        // Debugging: Check incoming request data
        console.log("Incoming Request Body:", req);

        const { name, subject,phone,email,country, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const response = await fetch(`${env.CRM_API_URL}/api/lead-save`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email,subject,phone,country, message }),
        });

        if (!response.ok) {
            throw new Error("Failed to submit contact form");
        }

        const responseData = await response.json();
        console.log("API Response:", responseData);

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "POST");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");

        res.status(200).json({ success: true, message: "Message sent successfully", data: responseData });
    } catch (error) {
        console.log(error);

        console.error("API Route Error:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
}
