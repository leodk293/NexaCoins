import { auth } from '../../auth';

export default async function handler(req, res) {
    try {
        const session = await auth();
        console.log("Session data:", session); 
        res.status(200).json({ session });
    } catch (error) {
        console.error("Session retrieval error:", error);
        res.status(500).json({ error: "Failed to retrieve session." });
    }
}
