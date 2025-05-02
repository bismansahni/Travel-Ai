


import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    const { rows } = await pool.query(
      `SELECT * FROM itineraries WHERE user_email = $1`,
      [email]
    );

    console.log("Fetched trips for user:", email, rows);

    if (!rows.length) {
      return NextResponse.json({ message: "No trips found" }, { status: 404 });
    }

    return NextResponse.json({ trips: rows });
  } catch (err) {
    console.error("Error fetching trips:", err);
    return NextResponse.json({ error: "Failed to fetch trips" }, { status: 500 });
  }
}