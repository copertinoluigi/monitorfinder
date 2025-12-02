import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(apiKey);

// Usiamo il modello Flash perché è veloce ed economico/gratis
export const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
