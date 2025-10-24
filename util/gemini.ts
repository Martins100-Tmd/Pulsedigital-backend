import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { Prompt } from "./aiPrompt";

dotenv.config();

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!,
});

export async function askGemini(content: string) {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `${Prompt}
Question:
${content}
    `,
    });

    return response.text;
}
