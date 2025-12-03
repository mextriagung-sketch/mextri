import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../types";

export const generateQuestions = async (count: number = 20): Promise<Question[]> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Generate ${count} unique multiple-choice questions about Informatics, Computer Science, and Digital Technology for high school students. 
    The questions should be in Indonesian language.
    Each question must have exactly 4 options and 1 correct answer.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              question: { type: Type.STRING },
              options: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              correctAnswerIndex: { type: Type.INTEGER, description: "Index of correct option (0-3)" },
              category: { type: Type.STRING }
            },
            required: ["id", "question", "options", "correctAnswerIndex"]
          }
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      // Ensure IDs are unique strings just in case
      return data.map((q: any, i: number) => ({
        ...q,
        id: `gen_${Date.now()}_${i}`
      }));
    }
    return [];
  } catch (error) {
    console.error("Gemini generation error:", error);
    throw error;
  }
};
