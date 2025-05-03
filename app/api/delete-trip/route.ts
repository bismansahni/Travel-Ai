import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function DELETE(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  const destination = req.nextUrl.searchParams.get("destination");

  if (!email || !destination) {
    return NextResponse.json({ error: "Email and destination are required" }, { status: 400 });
  }

  try {
    const result = await pool.query(
      `DELETE FROM itineraries WHERE user_email = $1 AND destination = $2`,
      [email, destination]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Trip deleted successfully" });

  } catch (err) {
    console.error("Error deleting trip:", err);
    return NextResponse.json({ error: "Failed to delete trip" }, { status: 500 });
  }
}
