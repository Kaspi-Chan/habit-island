import { GoogleGenAI, Type } from "@google/genai";
import { userInfo } from "../components/store/userStore";
import { motivation } from "../types";

const ai = new GoogleGenAI({
  apiKey: "",
});

export async function assignTaskProperties(
  title: string,
  motivation: motivation
) {
  const skills = userInfo.skills.map((s) => s.name);

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

  return response;
}
