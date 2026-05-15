import dotenv from "dotenv";
import { GoogleGenAI} from "@google/genai";
import { COMMIT_PROMPT } from "../utils/commitPrompt";
import { CODE_EXPLANATION_PROMPT } from "../utils/codeExplanator";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export const generateContent = async (
  prevCode: string,
  newCode: string,
  context?: string,
): Promise<string> => {
  try {
    const result = await ai.models.generateContent({
      model: "models/gemini-2.5-flash-lite",
      contents: COMMIT_PROMPT(prevCode, newCode, context),
    });

    const commitMessage = result.text || "";

    return commitMessage.replace(/\n/g, " ");
  } catch (err) {
    console.log("Error: ", err);
    throw err;
  }
};

export const explainCode = async (
  code: string,
  question: string,
): Promise<string> => {
  try {
    const result = await ai.models.generateContent({
      model: "models/gemini-3.1-flash-lite",
      contents: `
      User's question: ${question}

      ${CODE_EXPLANATION_PROMPT(code, question)}
      `,
      config: {
        thinkingConfig: {
          thinkingBudget: -1,
        },
      },
    });

   const responseText = result.text || "";
   const jsonStartIndex = responseText.indexOf("{");
   const jsonEndIndex = responseText.lastIndexOf("}") + 1;
   const cleanedResponse = responseText.substring(jsonStartIndex, jsonEndIndex);
   const parsed = JSON.parse(cleanedResponse);

    return parsed;
  } catch (err) {
    console.log("Error: ", err);
    throw err;
  }
};
