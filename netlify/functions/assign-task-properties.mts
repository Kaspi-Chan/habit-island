import { GoogleGenAI, Type } from "@google/genai";
import { motivation } from "../../src/types";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

interface event {
  body?: string;
}

exports.handler = async function (event: event) {
  try {
    const { title, motivation, skills } = JSON.parse(event.body || "{}") as {
      title: string;
      motivation: motivation;
      skills: string[];
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Assign XP and 1 to 3 categories for task: ${title}, User motivation: ${motivation}`,
      config: {
        systemInstruction: `You are a task classifier. Factor in the complexity of the task. Categories list: ${skills.join(
          ", "
        )}. XP must be between 10 and 50. More motivation equals less points`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            categories: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
                enum: skills,
              },
            },
            xp: {
              type: Type.NUMBER,
              minimum: 10,
              maximum: 50,
            },
          },
          propertyOrdering: ["categories", "xp"],
        },
      },
    });

    const data = response.text;
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error: any) {
    console.error("Function error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
