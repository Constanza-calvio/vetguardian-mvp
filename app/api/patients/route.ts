import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const patients = await sql`SELECT * FROM patients`;
  return NextResponse.json(patients);
}
export async function POST(request: Request) {
  const body = await request.json();

  const { name, species, owner } = body;

  if (!name || !species || !owner) {
    return NextResponse.json(
      { error: "Faltan campos obligatorios" },
      { status: 400 }
    );
  }

  await sql`
    INSERT INTO patients (name, species, owner)
    VALUES (${name}, ${species}, ${owner})
  `;

  return NextResponse.json({ success: true });
}