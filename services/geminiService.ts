
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, WorkoutSession, Message } from "../types";

export const analyzeWorkout = async (profile: UserProfile, session: WorkoutSession, history: WorkoutSession[]) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.error("VITE_GEMINI_API_KEY is missing!");
    return { analysis: "VIRHE: API-avain puuttuu asetuksista.", rating: "red" };
  }

  const ai = new GoogleGenAI({ apiKey });
  const model = 'gemini-2.0-flash';
  const isArnold = profile.coachType === 'arnold';

  const historyContext = history
    .slice(-7) // Increased to capture more context including activities
    .map(s => {
      if (s.type === 'Aktiviteetti') return `${s.date}: Aktiviteetti (${s.activityNotes})`;
      if (s.isSkipped) return `${s.date}: Lepo (${s.skipReason})`;
      return `${s.date}: ${s.exercises.map(e => `${e.name}${e.isPRAttempt ? ' (PR)' : ''}`).join(', ')}`;
    })
    .join('\n');

  const sessionDetails = session.exercises.map(e =>
    `${e.name} ${e.isPRAttempt ? '(PR-yritys)' : ''}: ${e.sets.map(s => `${s.reps}x${s.weight}kg`).join(', ')}`
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

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        systemInstruction,
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: {
              type: Type.STRING,
              description: "Treenin analyysi ja palaute käyttäjälle."
            },
            rating: {
              type: Type.STRING,
              enum: ['green', 'yellow', 'red'],
              description: "Treenin onnistumisen taso."
            }
          },
          required: ['analysis', 'rating']
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    return { analysis: isArnold ? "Good job! **Hasta la vista, gym.**" : "Hieno treeni takana!", rating: "green" };
  }
};

export const getChatResponse = async (profile: UserProfile, history: WorkoutSession[], chatHistory: Message[], userInput: string) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) return "Virhe: API-avain puuttuu.";

  const ai = new GoogleGenAI({ apiKey });
  const model = 'gemini-2.0-flash';
  const isArnold = profile.coachType === 'arnold';

  const historyContext = history
    .slice(-10)
    .map(s => {
      if (s.type === 'Aktiviteetti') return `${s.date}: Aktiviteetti (${s.activityNotes})`;
      if (s.isSkipped) return `${s.date}: Lepo (${s.skipReason})`;
      return `${s.date}: Sali (${s.exercises.map(e => e.name).join(', ')})`;
    })
    .join('\n');

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

  const messages = chatHistory.map(m => ({ role: m.role, parts: [{ text: m.text }] }));

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [...messages, { role: 'user', parts: [{ text: userInput }] }],
      config: { systemInstruction }
    });
    return response.text;
  } catch (error) {
    return isArnold ? "I'll be back (yhteysvirhe)." : "Pieni katkos, kysyisitkö uudestaan?";
  }
};
