import { NextResponse } from "next/server";
import { readSession } from "@/lib/auth";

export async function GET() {
  const user = await readSession();
  return NextResponse.json({ user });
}
