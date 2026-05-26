import { UserProfile, WorkoutSession, Message } from "../types";

export const analyzeWorkout = async (profile: UserProfile, session: WorkoutSession, history: WorkoutSession[]) => {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile, session, history })
    });
    
    if (!response.ok) {
      throw new Error('API request failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error calling /api/analyze:', error);
    const isArnold = profile.coachType === 'arnold';
    return { analysis: isArnold ? "Good job! **Hasta la vista, gym.**" : "Hieno treeni takana!", rating: "green" };
  }
};

export const getChatResponse = async (profile: UserProfile, history: WorkoutSession[], chatHistory: Message[], userInput: string) => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile, history, chatHistory, userInput })
    });
    
    if (!response.ok) {
      throw new Error('API request failed');
    }
    
    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error('Error calling /api/chat:', error);
    const isArnold = profile.coachType === 'arnold';
    return isArnold ? "I'll be back (yhteysvirhe)." : "Pieni katkos, kysyisitkö uudestaan?";
  }
};
