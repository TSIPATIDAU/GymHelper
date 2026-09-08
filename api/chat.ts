export default async function handler(req: any, res: any) {
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    try {
        const apiKey = process.env.OPENROUTER_API_KEY || process.env.API_KEY || process.env.GEMINI_API_KEY;
        if (!apiKey) return res.status(500).json({ error: 'OPENROUTER_API_KEY is missing on the server.' });

        const model = process.env.OPENROUTER_MODEL || 'anthropic/claude-3.7-sonnet';
        const { profile, history, chatHistory, userInput } = req.body;
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

        const formattedChatHistory = (chatHistory || []).map((m: any) => ({
            role: m.role === 'model' || m.role === 'assistant' ? 'assistant' : 'user',
            content: m.text || m.content || ''
        }));

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://voima-app.vercel.app",
                "X-Title": "VoimaAPP"
            },
            body: JSON.stringify({
                model,
                messages: [
                    { role: 'system', content: systemInstruction },
                    ...formattedChatHistory,
                    { role: 'user', content: userInput }
                ]
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error("OpenRouter API error (Chat):", response.status, errText);
            return res.status(response.status).json({ error: 'OpenRouter API Error', details: errText });
        }

        const data = await response.json();
        const responseText = data.choices?.[0]?.message?.content || '';

        return res.status(200).json({ text: responseText });
    } catch (error: any) {
        console.error("Serverless Function Error (Chat):", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
