import { GoogleGenAI } from "@google/genai";
import { Product } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateProductStory = async (product: Product): Promise<string> => {
  try {
    const prompt = `
      Write a short, luxurious, and evocative description (max 60 words) for a jewelry piece named "${product.name}". 
      It is a ${product.category} made of ${product.metal} featuring a ${product.specs.carat} carat diamond 
      (Color: ${product.specs.color}, Clarity: ${product.specs.clarity}).
      The tone should be sophisticated, romantic, and akin to high-end brands like Cartier or Van Cleef.
      Focus on the emotion and sparkle. Do not use markdown.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "A masterpiece of light and shadow, crafted for eternity.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return `An exquisite ${product.metal} ${product.category.toLowerCase()} featuring a stunning ${product.specs.carat} carat stone. A timeless addition to any collection.`;
  }
};
