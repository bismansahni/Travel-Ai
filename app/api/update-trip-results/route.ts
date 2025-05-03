import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function PATCH(req: NextRequest) {
  const { tid, activities, estimatedcost, day } = await req.json();

  if (!tid) {
    return NextResponse.json({ error: "Trip ID is required" }, { status: 400 });
  }

  try {
    const fields = [];
    const values = [];
    let index = 1;

    if (activities) fields.push(`activities = $${index++}`), values.push(activities);
    if (estimatedcost !== undefined) fields.push(`estimatedcost = $${index++}`), values.push(estimatedcost);
    if (day) fields.push(`day = $${index++}`), values.push(day);

    if (fields.length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    values.push(tid);
    const sql = `UPDATE tresult SET ${fields.join(", ")} WHERE tid = $${index}`;
    await pool.query(sql, values);

    return NextResponse.json({ message: "Trip result updated successfully" });
  } catch (err) {
    console.error("Update tresult error:", err);
    return NextResponse.json({ error: "Failed to update trip result" }, { status: 500 });
  }
}
