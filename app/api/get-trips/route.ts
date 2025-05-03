import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");

  console.log("Incoming request to fetch trips for email:", email);

  if (!email) {
    console.warn("No email provided in query params");
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const sqlQuery = `
    SELECT 
      t.tid, t.startdate, t.enddate, t.duration, t.location, t.budget, t.preference, t.uid,
      r.rid, r.activities, r.estimatedcost, r.day
    FROM travelsearch t
    JOIN users u ON t.uid = u.uid
    LEFT JOIN tresult r ON t.tid = r.tid
    WHERE u.email = $1
    ORDER BY t.tid, r.day
  `;

  console.log("SQL Query:\n", sqlQuery);

  try {
    const { rows } = await pool.query(sqlQuery, [email]);

    console.log("Raw rows from DB:", rows);

    if (!rows.length) {
      console.log("No trips found for user:", email);
      return NextResponse.json({ message: "No trips found" }, { status: 404 });
    }

    const tripsMap = new Map();

    for (const row of rows) {
      const {
        tid, startdate, enddate, duration, location, budget, preference, uid,
        rid, activities, estimatedcost, day
      } = row;

      if (!tripsMap.has(tid)) {
        tripsMap.set(tid, {
          tid,
          startdate,
          enddate,
          duration,
          location,
          budget,
          preference,
          uid,
          result: []
        });
      }

      if (rid !== null) {
        tripsMap.get(tid).result.push({
          rid,
          activities,
          estimatedcost,
          day
        });
      }
    }

    const trips = Array.from(tripsMap.values());

    console.log("Final transformed trips object:", trips);

    return NextResponse.json({ trips });
  } catch (err) {
    console.error("Error fetching trips with results:", err);
    return NextResponse.json({ error: "Failed to fetch trips and results" }, { status: 500 });
  }
}
