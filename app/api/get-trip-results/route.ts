import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function GET(req: NextRequest) {
  const tid = req.nextUrl.searchParams.get("tid");

  if (!tid) {
    return NextResponse.json({ error: "tid is required" }, { status: 400 });
  }

  try {
    const { rows } = await pool.query(
      `SELECT activities FROM tresult WHERE tid = $1`,
      [tid]
    );

    if (!rows.length) {
      return NextResponse.json({ error: "No results found" }, { status: 404 });
    }

    // activities is stored as a JSON string
    const activities = JSON.parse(rows[0].activities);  // array of days
    return NextResponse.json({ activities });
  } catch (err) {
    console.error("get‑trip‑results error:", err);
    return NextResponse.json({ error: "Failed to fetch results" }, { status: 500 });
  }
}
