// app/api/update-trip/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function PATCH(req: NextRequest) {
  const { tid, startdate, enddate, location, budget, preferences } = await req.json();

  if (!tid) {
    return NextResponse.json({ error: "Trip ID is required" }, { status: 400 });
  }

  try {
    const fields = [];
    const values = [];
    let index = 1;

    if (startdate) fields.push(`startdate = $${index++}`), values.push(startdate);
    if (enddate) fields.push(`enddate = $${index++}`), values.push(enddate);
    if (location) fields.push(`location = $${index++}`), values.push(location);
    if (budget) fields.push(`budget = $${index++}`), values.push(budget);
    if (preferences !== undefined) fields.push(`preferences = $${index++}`), values.push(preferences);

    if (fields.length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    values.push(tid);
    const sqlQuery = `UPDATE travelsearch SET ${fields.join(", ")} WHERE tid = $${index}`;
    await pool.query(sqlQuery, values);

    return NextResponse.json({ message: "Trip updated successfully" });
  } catch (err) {
    console.error("Update trip error:", err);
    return NextResponse.json({ error: "Failed to update trip" }, { status: 500 });
  }
}
