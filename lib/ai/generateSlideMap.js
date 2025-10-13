import OpenAI from "openai";
import { ECG_MODULE_PROMPT } from "./ecgPromptTemplate.js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateSlideMap(pptxText) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Using gpt-4o instead of gpt-5 (which doesn't exist yet)
      messages: [
        { role: "system", content: ECG_MODULE_PROMPT },
        { role: "user", content: pptxText }
      ],
      temperature: 0.4,
    });

    const raw = response.choices[0].message.content;
    if (!raw) {
      throw new Error("No response from OpenAI");
    }

    try {
      return JSON.parse(raw);
    } catch (err) {
      console.error("Invalid JSON returned from model:", err);
      console.error("Raw response:", raw);
      
      // Try to extract JSON from the response if it's wrapped in markdown
      const jsonMatch = raw.match(/```json\n([\s\S]*?)\n```/) || raw.match(/(\{[\s\S]*\})/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[1]);
        } catch (parseErr) {
          console.error("Failed to parse extracted JSON:", parseErr);
        }
      }
      
      return null;
    }
  } catch (error) {
    console.error("Error generating slide map:", error);
    return null;
  }
}

