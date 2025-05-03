import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function DELETE(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  const tripId = req.nextUrl.searchParams.get("tripId");

  if (!email || !tripId) {
    return NextResponse.json({ error: "Email and destination are required" }, { status: 400 });
  }

  const sqlQuery = `SELECT t.tid FROM travelsearch t
  JOIN users u ON t.uid = u.uid
  WHERE u.email = $1 AND t.tid = $2`

  try {
    const result = await pool.query(
      sqlQuery,
      [email, tripId]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    await pool.query(`DELETE FROM travelsearch WHERE tid = $1`, [tripId]);

    return NextResponse.json({ message: "Trip deleted successfully" });

  } catch (err) {
    console.error("Error deleting trip:", err);
    return NextResponse.json({ error: "Failed to delete trip" }, { status: 500 });
  }
}
