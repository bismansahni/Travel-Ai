import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  const tid = req.nextUrl.searchParams.get("tid");

  if (!email || !tid) {
    return NextResponse.json(
      { error: "Email and trip ID (tid) are required" },
      { status: 400 }
    );
  }

  try {
    
    const { rows } = await pool.query(
      `
      SELECT r.rid, r.activities, r.estimatedcost, r.day, r.tid
      FROM tresult r
      JOIN travelsearch t ON r.tid = t.tid
      JOIN users u ON t.uid = u.uid
      WHERE u.email = $1 AND r.tid = $2
      `,
      [email, tid]
    );

    if (!rows.length) {
      return NextResponse.json(
        { error: "No result found or unauthorized access" },
        { status: 404 }
      );
    }

    console.log("Fetched tresults:", rows);

    return NextResponse.json({ result: rows[0] });
  } catch (err) {
    console.error("Error fetching result:", err);
    return NextResponse.json(
      { error: "Failed to fetch result" },
      { status: 500 }
    );
  }
}