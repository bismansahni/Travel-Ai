import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { activities, estimatedcost, day, tid } = body;

  if (!activities || !Number.isFinite(day) || !Number.isFinite(tid)) {
    return NextResponse.json(
      { error: "Activities, day, and tid are required" },
      { status: 400 }
    );
  }  

  try {
    
    const result = await pool.query(
      `INSERT INTO tresult (activities, estimatedcost, day, tid)
       VALUES ($1, $2, $3, $4)
       RETURNING rid`,
      [activities, estimatedcost ?? null, day, tid]
    );

    const rid = result.rows[0].rid;
    return NextResponse.json({ rid });
  } catch (err: any) {
    console.error("Error adding trip result:", err);

    if (err.code === "23505") {
      return NextResponse.json(
        { error: "Result already exists for this trip ID (tid must be unique)" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to add trip result" },
      { status: 500 }
    );
  }
}
