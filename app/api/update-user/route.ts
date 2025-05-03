import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function PATCH(req: NextRequest) {
  const { email, name, password } = await req.json();

  if (!email || (!name && !password)) {
    return NextResponse.json({ error: "Email and at least one field to update are required" }, { status: 400 });
  }

  try {
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await pool.query(`UPDATE users SET password = $1 WHERE email = $2`, [hashedPassword, email]);
    }

    if (name) {
      await pool.query(`UPDATE users SET name = $1 WHERE email = $2`, [name, email]);
    }

    return NextResponse.json({ message: "User updated successfully" });
  } catch (err) {
    console.error("Update user error:", err);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
