import { GoogleGenAI, Type } from "@google/genai";

export default async function handler(req: any, res: any) {
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    try {
        const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || process.env.VITE_GEMINI_API_KEY;
        if (!apiKey) return res.status(500).json({ error: 'API key is missing on the server.' });

        const ai = new GoogleGenAI({ apiKey });
        const { profile, session, history } = req.body;

        const model = 'gemini-2.0-flash';
        const isArnold = profile.coachType === 'arnold';

        const historyContext = history.slice(-7).map((s: any) => {
            if (s.type === 'Aktiviteetti') return `${s.date}: Aktiviteetti (${s.activityNotes})`;
            if (s.isSkipped) return `${s.date}: Lepo (${s.skipReason})`;
            return `${s.date}: ${s.exercises.map((e: any) => `${e.name}${e.isPRAttempt ? ' (PR)' : ''}`).join(', ')}`;
        }).join('\n');

        const sessionDetails = session.exercises.map((e: any) =>
            `${e.name} ${e.isPRAttempt ? '(PR-yritys)' : ''}: ${e.sets.map((s: any) => `${s.reps}x${s.weight}kg`).join(', ')}`
        ).join('\n');

        const userStats = `Paino: ${profile.weight}kg, Pituus: ${profile.height}cm, SBD: B:${profile.benchPR} S:${profile.squatPR} D:${profile.deadliftPR}. Tila: ${profile.status}. Aktiivisuus: ${profile.gymDuration || 'Ei tietoa'}. Tauko: ${profile.breakDuration || 'Ei ole'}.`;

        const systemInstruction = isArnold
            ? `Olet Arnold Schwarzenegger. Käytä sitaatteja kuten "More energy!", "Stay hungry", "I'll be back". Jos treeni oli hyvä, sano "Hasta la vista, gym." Jos laiskottelua tai ei kehitystä, sano "You can have results or excuses!" tai "No excuses!". Puhu suomea. Käytä Markdown-muotoilua (lihavointi otsikoille, kappalejaot). Huomioi myös käyttäjän välipäivien aktiviteetit.`
            : `Olet Aino-Valmentaja, maailmanluokan PT. Tunnet käyttäjän tiedot: ${userStats}. Käytä Markdown-muotoilua: lihavoi pääkohdat ja käytä selkeitä kappaleita. Huomioi myös käyttäjän välipäivien aktiviteetit analyysissäsi.`;

        const prompt = `
          Käyttäjä: ${profile.name}, Tavoite: ${profile.goal}.
          Tämän päivän treeni: ${sessionDetails}
          
          Aiempi historia (sisältää myös aktiviteetit ja lepopäivät):
          ${historyContext}

          TEHTÄVÄ: Analysoi treeni suhteessa tavoitteeseen ja historiaan. Jos historiassa on paljon aktiviteetteja välipäivinä, huomioi ne palautumisessa.
          Vastaa JSON-muodossa. Käytä lihavointia ja kappaleita analyysitekstissä.
        `;

        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                systemInstruction,
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        analysis: { type: Type.STRING, description: "Treenin analyysi ja palaute käyttäjälle." },
                        rating: { type: Type.STRING, enum: ['green', 'yellow', 'red'], description: "Treenin onnistumisen taso." }
                    },
                    required: ['analysis', 'rating']
                }
            }
        });

        return res.status(200).json(JSON.parse(response.text || '{}'));
    } catch (error: any) {
        console.error("Serverless Function Error (Analyze):", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
