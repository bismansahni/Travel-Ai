import { NextRequest, NextResponse } from "next/server"
import { Pool } from "pg"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

export async function POST(req: NextRequest) {
  try {
    const { userEmail, startDate, endDate, budget, destination, preferences } = await req.json()

    const userResult = await pool.query(
      `SELECT uid FROM users WHERE email = $1`,
      [userEmail]
    );

    if (!userResult.rows.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const uid = userResult.rows[0].uid;


    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

    const insertResult = await pool.query(
      `
      INSERT INTO travelsearch (startdate, enddate, duration, location, budget, uid, preferences)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING tid
      `,
      [startDate, endDate, duration, destination, budget, uid, preferences || null ]
    );

    const newTripId = insertResult.rows[0].tid;

    return NextResponse.json({
      message: "Trip saved successfully",
      tripId: newTripId,
    });
  } catch (err) {
    console.error("Itinerary save error:", err)
    return NextResponse.json({ error: "Failed to save itinerary" }, { status: 500 })
  }
}
