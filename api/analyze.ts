export default async function handler(req: any, res: any) {
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    return res.status(200).json({
        analysis: "Treeni tallennettu onnistuneesti!",
        rating: "green"
    });
}
