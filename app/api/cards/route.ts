import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const collection = searchParams.get("collection");

  const cards = await prisma.card.findMany({
    where: collection ? { collection } : {},
    orderBy: { number: "asc" },
  });

  return NextResponse.json(cards);
}
