import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Les enchères utilisent désormais /api/auctions." },
    { status: 410 },
  );
}
