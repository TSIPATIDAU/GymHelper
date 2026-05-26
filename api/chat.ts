import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    try {
        const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || process.env.VITE_GEMINI_API_KEY;
        if (!apiKey) return res.status(500).json({ error: 'API key is missing on the server.' });

        const ai = new GoogleGenAI({ apiKey });
        const { profile, history, chatHistory, userInput } = req.body;

        const model = 'gemini-2.0-flash';
        const isArnold = profile.coachType === 'arnold';

        const historyContext = history.slice(-10).map((s: any) => {
            if (s.type === 'Aktiviteetti') return `${s.date}: Aktiviteetti (${s.activityNotes})`;
            if (s.isSkipped) return `${s.date}: Lepo (${s.skipReason})`;
            return `${s.date}: Sali (${s.exercises.map((e: any) => e.name).join(', ')})`;
        }).join('\n');

        const userStats = `
          Nimi: ${profile.name}
          Paino: ${profile.weight}kg, Pituus: ${profile.height}cm, Sukupuoli: ${profile.gender}
          SBD: Penkki:${profile.benchPR}kg, Kyykky:${profile.squatPR}kg, Maastaveto:${profile.deadliftPR}kg
          Tavoite: ${profile.goal}
          Tila: ${profile.status}
          Treenihistoria: ${profile.gymDuration || 'Aloittelija'}
          Tauon kesto: ${profile.breakDuration || 'Ei taukoa'}
          
          Treenihistoria sovelluksessa (mukaan lukien välipäivien aktiviteetit):
          ${historyContext}
        `;

        const systemInstruction = isArnold
            ? `Olet Arnold Schwarzenegger. Sinulla on pääsy käyttäjän tietoihin ja historiaan: ${userStats}. Käytä sitaatteja. Puhu suomea. MUOTOILU: Käytä **lihavointia** ja kappalejakoja. Huomioi välipäivien liikehdintä (aktiviteetit) jos käyttäjä kysyy palautumisesta.`
            : `Olet Aino-Valmentaja. Sinulla on pääsy kaikkiin käyttäjän tietoihin ja historiaan: ${userStats}. Auta käyttäjää saavuttamaan tavoitteet. MUOTOILU: Käytä **lihavointia** ja selkeitä kappaleita. Huomioi välipäivien liikehdintä (aktiviteetit) osana kokonaiskuvaa.`;

        const messages = chatHistory.map((m: any) => ({ role: m.role, parts: [{ text: m.text }] }));

        const response = await ai.models.generateContent({
            model,
            contents: [...messages, { role: 'user', parts: [{ text: userInput }] }],
            config: { systemInstruction }
        });

        return res.status(200).json({ text: response.text });
    } catch (error: any) {
        console.error("Serverless Function Error (Chat):", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
