import { NextRequest, NextResponse } from "next/server"
import { Pool } from "pg"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

export async function POST(req: NextRequest) {
  try {
    const { userEmail, destination, startDate, endDate, budget, preferences, itineraryData } = await req.json()

    await pool.query(
      `INSERT INTO itineraries 
        (user_email, destination, start_date, end_date, budget, preferences, data)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        userEmail,
        destination,
        startDate,
        endDate,
        budget,
        preferences || null,
        itineraryData,
      ]
    )

    return NextResponse.json({ message: "Itinerary saved successfully" })
  } catch (err) {
    console.error("Itinerary save error:", err)
    return NextResponse.json({ error: "Failed to save itinerary" }, { status: 500 })
  }
}
