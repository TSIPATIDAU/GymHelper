export default async function handler(req: any, res: any) {
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    try {
        const apiKey = process.env.OPENROUTER_API_KEY || process.env.API_KEY || process.env.GEMINI_API_KEY;
        if (!apiKey) return res.status(500).json({ error: 'OPENROUTER_API_KEY is missing on the server.' });

        const model = process.env.OPENROUTER_MODEL || 'anthropic/claude-3.7-sonnet';
        const { profile, session, history } = req.body;
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

TÄRKEÄÄ: Vastaa ainoastaan kelvollisessa JSON-muodossa ilman mitään muuta tekstiä.
Muoto:
{
  "analysis": "Treenin analyysi ja palaute käyttäjälle.",
  "rating": "green"
}
Rating voi olla ainoastaan 'green', 'yellow' tai 'red'.
`;

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
                response_format: { type: "json_object" },
                messages: [
                    { role: 'system', content: systemInstruction },
                    { role: 'user', content: prompt }
                ]
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error("OpenRouter API error (Analyze):", response.status, errText);
            return res.status(response.status).json({ error: 'OpenRouter API Error', details: errText });
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || '{}';

        let parsed = { analysis: '', rating: 'green' };
        try {
            parsed = JSON.parse(content);
        } catch {
            const match = content.match(/\{[\s\S]*\}/);
            if (match) {
                parsed = JSON.parse(match[0]);
            } else {
                parsed = { analysis: content, rating: 'green' };
            }
        }

        return res.status(200).json(parsed);
    } catch (error: any) {
        console.error("Serverless Function Error (Analyze):", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
