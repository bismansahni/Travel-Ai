


import { NextRequest, NextResponse } from "next/server"
import { GoogleGenAI, Type } from "@google/genai"

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { destination, startDate, endDate, budget, preferences } = body

    const prompt = `
      Plan a ${Math.round(
        (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
      )} day trip to ${destination}.
      Budget: $${budget}
      Preferences: ${preferences || "General travel"}
      Start Date: ${startDate}, End Date: ${endDate}
      Return a JSON object matching the given schema.
    `

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            destination: {
              type: Type.STRING,
              description: "Destination name",
              nullable: false,
            },
            activities: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.NUMBER },
                  date: { type: Type.STRING },
                  items: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        activity: { type: Type.STRING },
                        time: { type: Type.STRING },
                        cost: { type: Type.STRING },
                        description: { type: Type.STRING },
                      },
                      required: ["activity", "time", "cost", "description"],
                    },
                  },
                },
                required: ["day", "date", "items"],
              },
            },
          },
          required: ["destination", "activities"],
        },
      },
    })

    return NextResponse.json(JSON.parse(response.text))
  } catch (err) {
    console.error("Gemini API error:", err)
    return NextResponse.json({ error: "Failed to generate itinerary" }, { status: 500 })
  }
}
